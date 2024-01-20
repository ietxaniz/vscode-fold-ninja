import { updateStatusBarItem } from "../internal/updateStatusBarItem";
import { updateEditorStatus } from "../internal/updateEditorStatus";

export const initializationCommand = () => {
  updateStatusBarItem();
  updateEditorStatus(false);
}
