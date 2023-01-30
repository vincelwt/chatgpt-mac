import { ObjectStorage } from "@lemonade/infra-common/deployment";
import { getBucketNameWithRandomSuffix } from "@lemonade/infra-common/deployment/object_storage";
import * as aws from "@pulumi/aws";
import { Input } from "@pulumi/pulumi";

const bucketName = getBucketNameWithRandomSuffix("gpt-project");

const allowPublicWritePolicy: Input<
  aws.types.input.iam.GetPolicyDocumentStatement[]
> = bucketName.apply((bucketName) => [
  {
    actions: ["s3:PutObject"],
    effect: "Allow",
    resources: [`arn:aws:s3:::${bucketName}/*`],
    principals: [{ identifiers: ["*"], type: "AWS" }],
  },
]);

new ObjectStorage("gpt-project", {
  name: "gpt-project",
  policyStatements: allowPublicWritePolicy,
});
