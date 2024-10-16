require("dotenv").config({ path: "./.env.test" });

import assert from "assert";
import { TestHelpers, Split, SplitDistribution } from "generated";
const { MockDb, SplitFactory, SplitMain } = TestHelpers;

describe("Split contract event tests", () => {
  const mockDbInitial = MockDb.createMockDb();

  describe("SplitCreated event", () => {
    const event = SplitFactory.SplitCreated.createMockEvent({
      mockEventData: {
        srcAddress: "0xfactory",
      },
      owner: "0xOWNER",
      splitParams: [
        ["0x1234", "0x5678"],
        [BigInt(60), BigInt(40)],
        BigInt(100),
        BigInt(1),
      ],
    });

    it("creates a new Split entity correctly", async () => {
      const mockDbUpdated = await SplitFactory.SplitCreated.processEvent({
        event,
        mockDb: mockDbInitial,
      });

      const actualSplit = mockDbUpdated.entities.Split.get(
        `${event.chainId}_${event.params.owner}`,
      );

      const expectedSplit: Split = {
        id: `${event.chainId}_${event.params.owner}`,
        address: event.srcAddress,
        recipients: ["0x1234", "0x5678"],
        allocations: [BigInt(60), BigInt(40)],
        totalAllocation: BigInt(100),
        distributionIncentive: BigInt(1),
      };

      assert.deepEqual(
        actualSplit,
        expectedSplit,
        "Actual Split should be the same as the expected Split",
      );
    });
  });

  describe("SplitUpdated event", () => {
    const initialEvent = SplitFactory.SplitCreated.createMockEvent({
      mockEventData: {
        srcAddress: "0xfactory",
      },
      owner: "0xOWNER",
      splitParams: [
        ["0x1234", "0x5678"],
        [BigInt(60), BigInt(40)],
        BigInt(100),
        BigInt(1),
      ],
    });

    const updateEvent = SplitMain.SplitUpdated.createMockEvent({
      mockEventData: {
        srcAddress: "0xOWNER",
      },
      splitParams: [
        ["0x5678", "0x9ABC"],
        [BigInt(30), BigInt(20)],
        BigInt(100),
        BigInt(2),
      ],
    });

    it("updates an existing Split entity correctly", async () => {
      // First, create the initial Split entity
      let mockDbUpdated = await SplitFactory.SplitCreated.processEvent({
        event: initialEvent,
        mockDb: mockDbInitial,
      });

      // Then, update the Split entity
      mockDbUpdated = await SplitMain.SplitUpdated.processEvent({
        event: updateEvent,
        mockDb: mockDbUpdated,
      });

      const initialSplit = mockDbUpdated.entities.Split.get(
        `${initialEvent.chainId}_${initialEvent.params.owner}`,
      );

      const updatedSplit = mockDbUpdated.entities.Split.get(
        `${updateEvent.chainId}_${updateEvent.srcAddress}`,
      );

      const expectedSplit: Split = {
        id: `${updateEvent.chainId}_${updateEvent.srcAddress}`,
        address: updateEvent.srcAddress,
        recipients: ["0x5678", "0x9ABC"],
        allocations: [BigInt(30), BigInt(20)],
        totalAllocation: BigInt(100),
        distributionIncentive: BigInt(2),
      };

      // The test here is to make sure that the update event overwrote the initial event.
      // Otherwise it might just be a new split while the first one is still around.
      assert.deepEqual(
        initialSplit,
        expectedSplit,
        "Actual Split should be the same as the expected Split",
      );
      assert.deepEqual(
        updatedSplit,
        expectedSplit,
        "Actual Split should be the same as the expected Split",
      );
    });
  });

  describe("SplitDistributed event", () => {
    const event = SplitMain.SplitDistributed.createMockEvent({
      distributor: "0xDEF0",
      amount: BigInt(1000),
      token: "0xTOKEN",
    });

    it("creates a new SplitDistribution entity correctly", async () => {
      const mockDbUpdated = await SplitMain.SplitDistributed.processEvent({
        event,
        mockDb: mockDbInitial,
      });

      const actualSplitDistribution =
        mockDbUpdated.entities.SplitDistribution.get(
          `${event.chainId}_${event.srcAddress}_${event.logIndex}`,
        );

      const expectedSplitDistribution: SplitDistribution = {
        id: `${event.chainId}_${event.srcAddress}_${event.logIndex}`,
        split_id: `${event.chainId}_${event.srcAddress}`,
        distributor: "0xDEF0",
        amount: BigInt(1000),
        token: "0xTOKEN",
      };

      assert.deepEqual(
        actualSplitDistribution,
        expectedSplitDistribution,
        "Actual SplitDistribution should be the same as the expected SplitDistribution",
      );
    });
  });
});
