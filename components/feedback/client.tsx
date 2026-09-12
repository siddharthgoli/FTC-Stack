"use client";
import { cn } from "../../lib/cn";
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react-dom";
import { buttonVariants } from "../ui/button";
import { CornerDownRightIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import {
    type HTMLAttributes,
    type ReactNode,
    type SyntheticEvent,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
    useTransition,
} from "react";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { cva } from "class-variance-authority";
import {
    actionResponse,
    blockFeedback,
    pageFeedback,
    pageActionResponse,
    type ActionResponse,
    type BlockFeedback,
    type PageFeedback,
    type PageActionResponse,
} from "./schema";
import { z } from "zod/mini";
import { usePathname } from "fumadocs-core/framework";

const rateButtonVariants = cva(
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed",
    {
        variants: {
            active: {
                true: "border-fd-primary bg-fd-primary text-fd-primary-foreground",
                false: "border-fd-border/70 text-fd-muted-foreground hover:border-fd-primary/40 hover:text-fd-foreground",
            },
        },
    },
);

const pageFeedbackResult = z.extend(pageFeedback, {
    response: pageActionResponse,
});

const blockFeedbackResult = z.extend(blockFeedback, {
    response: actionResponse,
});

const positiveReasonOptions = [
    { key: "solved", label: "Solved a problem" },
    { key: "learned", label: "Learned something new" },
    { key: "improved", label: "Improved our code" },
] as const;

/**
 * A feedback component to be attached at the end of page
 */
export function Feedback({
    onSendAction,
}: {
    onSendAction: (
        feedback: PageFeedback,
        feedbackId?: number | string | null,
    ) => Promise<PageActionResponse>;
}) {
    const pathname = usePathname();
    const { previous, setPrevious } = useSubmissionStorage(pathname, (v) => {
        const result = pageFeedbackResult.safeParse(v);
        return result.success ? result.data : null;
    });
    const [opinion, setOpinion] = useState<"good" | "bad" | null>(null);
    const [reasons, setReasons] = useState<
        Array<"solved" | "learned" | "improved">
    >([]);
    const [teamNumber, setTeamNumber] = useState("");
    const [message, setMessage] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [feedbackId, setFeedbackId] = useState<number | string | null>(null);
    const [isPending, startTransition] = useTransition();

    function createFeedback(
        nextOpinion: "good" | "bad",
    ): PageFeedback {
        const normalizedTeamNumber =
            teamNumber.trim() === ""
                ? null
                : Number.isFinite(Number(teamNumber))
                  ? Number(teamNumber)
                  : null;

        return {
            url: location.href,
            opinion: nextOpinion,
            solved: nextOpinion === "good" && reasons.includes("solved"),
            learned: nextOpinion === "good" && reasons.includes("learned"),
            improved: nextOpinion === "good" && reasons.includes("improved"),
            teamNumber: normalizedTeamNumber,
            message,
        };
    }

    function saveFeedback(feedback: PageFeedback) {
        startTransition(async () => {
            const response = await onSendAction(feedback);
            if (!response.success) {
                setSubmitError(response.error ?? "We couldn't save your feedback.");
                return;
            }

            setSubmitError(null);
            setFeedbackId(response.feedbackId);
        });
    }

    function submit(e?: SyntheticEvent) {
        if (opinion == null || feedbackId == null) return;

        e?.preventDefault();
        startTransition(async () => {
            const response = await onSendAction(
                createFeedback(opinion),
                feedbackId,
            );
            if (!response.success) {
                setSubmitError(response.error ?? "We couldn't save your feedback.");
                return;
            }

            setSubmitError(null);
            setPrevious({
                response,
                ...createFeedback(opinion),
            });
            setMessage("");
            setTeamNumber("");
            setReasons([]);
            setOpinion(null);
        });
    }

    const activeOpinion = previous?.opinion ?? opinion;

    return (
        <Collapsible
            open={opinion !== null || previous !== null}
            onOpenChange={(v) => {
                if (!v) {
                    setOpinion(null);
                    setFeedbackId(null);
                    setReasons([]);
                    setTeamNumber("");
                    setMessage("");
                    setSubmitError(null);
                }
            }}
            className="rounded-lg border border-fd-border/60 bg-fd-card/60 p-3"
        >
            <div className="flex flex-col gap-2">
                <p className="text-center text-sm font-medium text-fd-foreground">
                    Was this resource helpful?
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        disabled={previous !== null || isPending}
                        aria-label="Helpful"
                        className={cn(
                            rateButtonVariants({
                                active: activeOpinion === "good",
                            }),
                            "h-10 w-full",
                        )}
                        onClick={() => {
                            if (opinion === "good") {
                                setOpinion(null);
                                setFeedbackId(null);
                                setReasons([]);
                                setTeamNumber("");
                                setMessage("");
                                setSubmitError(null);
                                return;
                            }

                            const nextOpinion = "good" as const;
                            setOpinion(nextOpinion);
                            saveFeedback(createFeedback(nextOpinion));
                        }}
                    >
                        <ThumbsUp className="size-4" />
                    </button>
                    <button
                        type="button"
                        disabled={previous !== null || isPending}
                        aria-label="Not helpful"
                        className={cn(
                            rateButtonVariants({
                                active: activeOpinion === "bad",
                            }),
                            "h-10 w-full",
                        )}
                        onClick={() => {
                            if (opinion === "bad") {
                                setOpinion(null);
                                setFeedbackId(null);
                                setReasons([]);
                                setTeamNumber("");
                                setMessage("");
                                setSubmitError(null);
                                return;
                            }

                            const nextOpinion = "bad" as const;
                            setOpinion(nextOpinion);
                            setReasons([]);
                            saveFeedback(createFeedback(nextOpinion));
                        }}
                    >
                        <ThumbsDown className="size-4" />
                    </button>
                </div>
            </div>
            <CollapsibleContent className="mt-3">
                {previous ? (
                    <div className="flex flex-col items-start gap-3 rounded-lg border border-fd-border/60 bg-fd-background/70 px-3 py-4 text-sm text-fd-muted-foreground">
                        <p>Thank you for your feedback!</p>
                        <button
                            className={cn(
                                buttonVariants({
                                    color: "secondary",
                                }),
                                "text-xs",
                            )}
                            onClick={() => {
                                setOpinion(previous.opinion);
                                setFeedbackId(previous.response.feedbackId);
                                setPrevious(null);
                                setSubmitError(null);
                            }}
                        >
                            Submit Again
                        </button>
                    </div>
                ) : (
                    <form className="flex flex-col gap-3" onSubmit={submit}>
                        {opinion === "good" && (
                            <div className="flex flex-wrap gap-2">
                                {positiveReasonOptions.map((option) => {
                                    const isActive = reasons.includes(
                                        option.key,
                                    );

                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            className={cn(
                                                rateButtonVariants({
                                                    active: isActive,
                                                }),
                                            )}
                                            onClick={() => {
                                                setReasons((current) =>
                                                    current.includes(option.key)
                                                        ? current.filter(
                                                              (item) =>
                                                                  item !==
                                                                  option.key,
                                                          )
                                                        : [
                                                              ...current,
                                                              option.key,
                                                          ],
                                                );
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <label className="flex flex-col gap-1 text-sm text-fd-muted-foreground">
                            <span>Team number (optional)</span>
                            <input
                                value={teamNumber}
                                onChange={(e) =>
                                    setTeamNumber(
                                        e.target.value.replace(/\D/g, ""),
                                    )
                                }
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="rounded-lg border border-fd-border/60 bg-fd-background/70 px-3 py-2 text-sm text-fd-foreground focus-visible:outline-none placeholder:text-fd-muted-foreground"
                                placeholder="e.g. 14481"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-fd-muted-foreground">
                            <span>Feedback (optional)</span>
                            <textarea
                                autoFocus
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-24 rounded-lg border border-fd-border/60 bg-fd-background/70 p-3 text-sm text-fd-foreground resize-none focus-visible:outline-none placeholder:text-fd-muted-foreground"
                                placeholder="Tell us more..."
                                onKeyDown={(e) => {
                                    if (!e.shiftKey && e.key === "Enter") {
                                        submit(e);
                                    }
                                }}
                            />
                        </label>

                        {submitError ? (
                            <p className="text-sm text-red-600">
                                {submitError}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            className={cn(
                                buttonVariants({ color: "outline" }),
                                "w-fit px-3",
                            )}
                            disabled={isPending}
                        >
                            Submit
                        </button>
                    </form>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}

export interface FeedbackTextProps {
    onSendAction: (feedback: BlockFeedback) => Promise<ActionResponse>;
    children?: ReactNode;
}

/**
 * A feedback component for each content block in page, should be used with `remark-feedback-block`.
 *
 * See https://fumadocs.dev/docs/integrations/feedback.
 */
export function FeedbackText({ onSendAction, children }: FeedbackTextProps) {
    const [popup, _setPopup] = useState<{
        mode: "tooltip" | "expanded";
        blockId: string;
        selection: string;
        range: Range;
    } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const { refs, floatingStyles } = useFloating({
        open: popup !== null,
        placement: "bottom",
        middleware: [offset(6), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    function expandPopup() {
        if (popup?.mode !== "tooltip") return;

        const highlight = new Highlight(popup.range);
        CSS.highlights.set("fd-feedback-text", highlight);

        _setPopup({ ...popup, mode: "expanded" });
    }

    function closePopup() {
        if (popup?.mode === "expanded") {
            CSS.highlights.delete("fd-feedback-text");
        }

        _setPopup(null);
    }

    const updateSelectionPopover = useEffectEvent(() => {
        if (popup && popup.mode === "expanded") return;

        const container = containerRef.current;
        const selection = window.getSelection();

        if (
            !container ||
            !selection ||
            selection.isCollapsed ||
            selection.rangeCount === 0
        ) {
            closePopup();
            return;
        }

        const range = selection.getRangeAt(0).cloneRange();
        if (!container.contains(range.commonAncestorContainer)) {
            closePopup();
            return;
        }

        const selectionText = selection.toString().trim();
        // also prevent cross-paragraph selection
        if (selectionText.length === 0 || selectionText.includes("\n")) {
            closePopup();
            return;
        }

        const element =
            range.startContainer instanceof Element
                ? range.startContainer
                : range.startContainer.parentElement;
        const blockId = element?.closest('[data-block="feedback"]')?.id;
        if (!blockId) {
            closePopup();
            return;
        }

        refs.setReference({
            getBoundingClientRect() {
                return range.getBoundingClientRect();
            },
            contextElement: container,
        });

        _setPopup({
            mode: "tooltip",
            range,
            selection: selectionText,
            blockId,
        });
    });

    const closeOnEscape = useEffectEvent((event: KeyboardEvent) => {
        if (popup === null) return;
        if (event.key === "Escape") closePopup();
    });

    const closeOnPointerDown = useEffectEvent((event: PointerEvent) => {
        const target = event.target;
        if (popup === null || !(target instanceof Node)) return;

        if (
            refs.floating.current?.contains(target) ||
            (popup.mode === "tooltip" && containerRef.current?.contains(target))
        ) {
            return;
        }

        closePopup();
    });

    useEffect(() => {
        let frame: number | null = null;

        function scheduleSelectionPopover() {
            if (frame !== null) window.cancelAnimationFrame(frame);

            frame = window.requestAnimationFrame(() => {
                frame = null;
                updateSelectionPopover();
            });
        }

        document.addEventListener("selectionchange", scheduleSelectionPopover);
        document.addEventListener("keydown", closeOnEscape);
        document.addEventListener("pointerdown", closeOnPointerDown);

        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.removeEventListener("pointerdown", closeOnPointerDown);
            document.removeEventListener(
                "selectionchange",
                scheduleSelectionPopover,
            );
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <>
            <div
                ref={containerRef}
                className="prose-no-margin [&_::highlight(fd-feedback-text)]:bg-fd-primary [&_::highlight(fd-feedback-text)]:text-fd-primary-foreground"
            >
                {children}
            </div>

            {popup && (
                <div
                    ref={refs.setFloating}
                    className={cn(
                        "not-prose z-40 text-sm bg-fd-popover text-fd-popover-foreground border overflow-hidden shadow-lg rounded-xl w-30 h-9.5 box-content transition-[width,height]",
                        popup.mode === "expanded"
                            ? "w-75 h-32 max-w-[98vw]"
                            : "select-none",
                    )}
                    style={floatingStyles}
                >
                    {popup.mode === "tooltip" ? (
                        <div className="w-30 h-9.5 p-1">
                            <button
                                className={cn(
                                    buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    }),
                                    "size-full gap-1.5",
                                )}
                                onClick={expandPopup}
                            >
                                <CornerDownRightIcon className="size-4 text-fd-muted-foreground" />
                                Feedback
                            </button>
                        </div>
                    ) : (
                        <FeedbackTextForm
                            blockId={popup.blockId}
                            selection={popup.selection}
                            onSendAction={onSendAction}
                            onClose={closePopup}
                            container={{
                                className:
                                    "p-2 w-[300px] h-32 max-w-[98vw] animate-fd-fade-in",
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
}

function FeedbackTextForm({
    blockId,
    selection,
    onSendAction,
    onClose,
    container,
}: {
    container: HTMLAttributes<HTMLElement>;
    blockId: string;
    selection: string;
    onSendAction: (feedback: BlockFeedback) => Promise<ActionResponse>;
    onClose: () => void;
}) {
    const pathname = usePathname();
    const { previous, setPrevious } = useSubmissionStorage(
        `${pathname}-${blockId}`,
        (v) => {
            const result = blockFeedbackResult.safeParse(v);
            if (result.success) return result.data;
            return null;
        },
    );
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    function submit(e?: SyntheticEvent) {
        startTransition(async () => {
            const feedback: BlockFeedback = {
                blockId,
                blockBody: selection,
                url: location.href,
                message,
            };

            const response = await onSendAction(feedback);
            setPrevious({
                response,
                ...feedback,
            });
            setMessage("");
        });

        e?.preventDefault();
    }

    if (previous)
        return (
            <div
                {...container}
                className={cn(
                    "flex flex-col items-center justify-center gap-2 text-fd-muted-foreground text-center",
                    container.className,
                )}
            >
                <p>Thank you for your feedback!</p>
                <div className="flex flex-row items-center gap-2">
                    <button
                        className={cn(
                            buttonVariants({
                                color: "secondary",
                            }),
                            "text-xs",
                        )}
                        onClick={() => {
                            setPrevious(null);
                        }}
                    >
                        Submit Again
                    </button>
                </div>
            </div>
        );

    return (
        <form
            {...container}
            className={cn("flex flex-col gap-2", container.className)}
            onSubmit={submit}
        >
            <textarea
                autoFocus
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded-lg bg-fd-secondary text-fd-secondary-foreground p-3 resize-none focus-visible:outline-none placeholder:text-fd-muted-foreground"
                placeholder="Leave your feedback..."
                onKeyDown={(e) => {
                    if (!e.shiftKey && e.key === "Enter") {
                        submit(e);
                    }
                }}
            />
            <div className="grid grid-cols-2 gap-2 mt-auto">
                <button
                    type="submit"
                    className={cn(
                        buttonVariants({ variant: "primary", size: "sm" }),
                        "gap-1.5",
                    )}
                    disabled={isPending}
                >
                    <CornerDownRightIcon className="size-4" />
                    Submit
                </button>
                <button
                    type="button"
                    className={cn(
                        buttonVariants({ variant: "secondary", size: "sm" }),
                        "gap-1.5",
                    )}
                    disabled={isPending}
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </form>
    );
}

function useSubmissionStorage<Result>(
    key: string,
    validate: (v: unknown) => Result | null,
) {
    const storageKey = `docs-feedback-${key}`;
    const [value, setValue] = useState<Result | null>(null);
    const validateCallback = useEffectEvent(validate);

    useEffect(() => {
        const item = localStorage.getItem(storageKey);
        if (item === null) return;
        const validated = validateCallback(JSON.parse(item));

        if (validated !== null) setValue(validated);
    }, [storageKey]);

    return {
        previous: value,
        setPrevious(result: Result | null) {
            if (result)
                localStorage.setItem(storageKey, JSON.stringify(result));
            else localStorage.removeItem(storageKey);

            setValue(result);
        },
    };
}
