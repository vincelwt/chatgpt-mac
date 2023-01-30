export * from '@lemonade/infra-common/deployment/shared'
import { ObjectStorage } from "@lemonade/infra-common/deployment";

new ObjectStorage("gpt-project", {
  name: "gpt-project",
});
