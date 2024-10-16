import { Split, SplitDistribution, SplitFactory, SplitMain } from "generated";
import { handlerContext, eventLog } from "generated";

type SplitParams = [string[], bigint[], bigint, bigint];

SplitFactory.SplitCreated.handler(async ({ event, context }) => {
  if (!isByOwner(event)) return;
  // The owner in this event is the account that created the split.
  // The srcAddress in this case is the address of the splits factory.
  const splitId = `${event.chainId}_${event.params.owner}`;
  return upsertSplit(event, context, splitId);
});

SplitMain.SplitUpdated.handler(async ({ event, context }) => {
  const splitId = `${event.chainId}_${event.srcAddress}`;
  return upsertSplit(event, context, splitId);
});

SplitMain.SplitDistributed.handler(async ({ event, context }) => {
  const entity: SplitDistribution = {
    id: `${splitId(event)}_${event.logIndex}`,
    split_id: splitId(event),
    distributor: event.params.distributor,
    amount: event.params.amount,
    token: event.params.token,
  };

  context.SplitDistribution.set(entity);
});

function splitId(event: eventLog<any>): string {
  return `${event.chainId}_${event.srcAddress}`;
}

async function upsertSplit(
  event: eventLog<{ readonly splitParams: SplitParams }>,
  context: handlerContext,
  splitId: string,
) {
  const entity: Split = {
    id: splitId,
    address: event.srcAddress,
    recipients: event.params.splitParams[0],
    allocations: event.params.splitParams[1],
    totalAllocation: event.params.splitParams[2],
    distributionIncentive: event.params.splitParams[3],
  };
  context.Split.set(entity);
}

function isByOwner(event: eventLog<{ readonly owner: string }>) {
  return event.params.owner === process.env.OWNER_ADDRESS;
}
