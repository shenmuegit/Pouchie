export type SaveFeedbackState = "idle" | "saving" | "success" | "error";
export type SaveFeedbackAction = "start" | "success" | "error" | "reset";

export type SaveFeedback = {
  state: SaveFeedbackState;
  message: string;
};

const FEEDBACK: Record<SaveFeedbackState, SaveFeedback> = {
  idle: { state: "idle", message: "" },
  saving: { state: "saving", message: "正在保存..." },
  success: { state: "success", message: "已记录" },
  error: { state: "error", message: "保存失败，请重试" }
};

export function nextSaveFeedback(
  current: SaveFeedbackState,
  action: SaveFeedbackAction
): SaveFeedback {
  if (action === "reset") return FEEDBACK.idle;
  if (action === "start") return FEEDBACK.saving;
  if (action === "success") return FEEDBACK.success;
  if (action === "error") return FEEDBACK.error;
  return FEEDBACK[current];
}
