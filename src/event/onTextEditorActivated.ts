import { readConfig } from "../configuration/config";
import { updateEditorStatus } from "../internal/updateEditorStatus";

export const onTextEditorActivated = async () => {
  const config = readConfig();
  await updateEditorStatus(config);
}
