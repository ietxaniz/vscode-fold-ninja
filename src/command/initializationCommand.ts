import { updateStatusBarItem } from "../internal/updateStatusBarItem";
import { updateEditorStatus } from "../internal/updateEditorStatus";
import { readConfig } from "../configuration/config";

export const initializationCommand = () => {
  updateStatusBarItem();
  const config = readConfig();
  updateEditorStatus(config);
}
