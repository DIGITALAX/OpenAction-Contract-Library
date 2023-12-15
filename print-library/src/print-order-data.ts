import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  JSONValueKind,
  ipfs,
  json,
} from "@graphprotocol/graph-ts";
import { PrintDesignData } from "../generated/PrintDesignData/PrintDesignData";
import {
  NFTOnlyOrderCreated as NFTOnlyOrderCreatedEvent,
  OrderCreated as OrderCreatedEvent,
  PrintOrderData,
  SubOrderIsFulfilled as SubOrderIsFulfilledEvent,
  UpdateNFTOnlyOrderMessage as UpdateNFTOnlyOrderMessageEvent,
  UpdateOrderDetails as UpdateOrderDetailsEvent,
  UpdateOrderMessage as UpdateOrderMessageEvent,
  UpdateSubOrderStatus as UpdateSubOrderStatusEvent,
} from "../generated/PrintOrderData/PrintOrderData";
import {
  CollectionCreated,
  NFTOnlyOrderCreated,
  OrderCreated,
  SubOrderIsFulfilled,
  UpdateNFTOnlyOrderMessage,
  UpdateOrderDetails,
  UpdateOrderMessage,
  UpdateSubOrderStatus,
} from "../generated/schema";

export function handleNFTOnlyOrderCreated(
  event: NFTOnlyOrderCreatedEvent
): void {
  let entity = new NFTOnlyOrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.orderId));

  entity.orderId = event.params.orderId;
  entity.totalPrice = event.params.totalPrice;
  entity.currency = event.params.currency;
  entity.pubId = event.params.pubId;
  entity.profileId = event.params.profileId;
  entity.buyer = event.params.buyer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let order = PrintOrderData.bind(
    Address.fromString("0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2")
  );
  entity.messages = order.getNFTOnlyOrderMessages(entity.orderId);

  let amounts: Array<string> = [];
  let collectionIds: Array<string> = [];
  let prices: Array<string> = [];
  let images: Array<string> = [];
  let names: Array<string> = [];

  let design = PrintDesignData.bind(
    Address.fromString("0xCBE04798e01842508B22DcB6d66f7d7D80ccc219")
  );

  for (let i = 0; i < 1; i++) {
    const amount = order.getNFTOnlyOrderAmount(entity.orderId);
    if (amount) {
      amounts.push(amount.toString());
    }
    const price = order.getNFTOnlyOrderTotalPrice(entity.orderId);
    if (price) {
      prices.push(price.toString());
    }

    const collId = order.getNFTOnlyOrderCollectionId(entity.orderId);
    if (collId) {
      collectionIds.push(collId.toString());

      let entityCollection = CollectionCreated.load(
        Bytes.fromByteArray(ByteArray.fromBigInt(collId))
      );

      if (entityCollection) {
        let orderIds: Array<BigInt> | null = entityCollection.orderIds;
        if (orderIds == null) {
          orderIds = [];
        }
        orderIds.push(event.params.orderId);
        entityCollection.orderIds = orderIds;

        let buyerProfileIds: Array<BigInt> | null =
          entityCollection.buyerProfileIds;
        if (buyerProfileIds == null) {
          buyerProfileIds = [];
        }
        const profileId = order.getNFTOnlyOrderBuyerProfileId(
          event.params.orderId
        );
        buyerProfileIds.push(profileId);
        entityCollection.buyerProfileIds = buyerProfileIds;

        entityCollection.save();
      }

      const uri = design.getCollectionURI(collId);
      if (uri) {
        let ipfsHash = uri.split("/").pop();

        if (ipfsHash != null) {
          let metadata = ipfs.cat(ipfsHash);
          if (metadata) {
            const value = json.fromBytes(metadata).toObject();
            if (value) {
              let image = value.get("images");
              if (image && image.kind === JSONValueKind.ARRAY) {
                images.push(
                  image.toArray().map<string>((item) => item.toString())[0]
                );
              }

              let cover = value.get("cover");
              if (cover && cover.kind === JSONValueKind.STRING) {
                images.push(cover.toString());
              }

              let title = value.get("title");
              if (title && title.kind === JSONValueKind.STRING) {
                names.push(title.toString());
              }
            }
          }
        }
      }
    }
  }

  entity.subOrderAmount = amounts;
  entity.subOrderCollectionIds = collectionIds;
  entity.subOrderPrice = prices;
  entity.images = images;
  entity.names = names;

  entity.save();
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new OrderCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.orderId));
  entity.orderId = event.params.orderId;
  entity.totalPrice = event.params.totalPrice;
  entity.currency = event.params.currency;
  entity.pubId = event.params.pubId;
  entity.profileId = event.params.profileId;
  entity.buyer = event.params.buyer;

  let order = PrintOrderData.bind(
    Address.fromString("0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2")
  );

  entity.details = order.getOrderDetails(entity.orderId);
  entity.messages = order.getOrderMessages(entity.orderId);
  const subs = order.getOrderSubOrders(entity.orderId);

  let amounts: Array<string> = [];
  let isFulfilleds: Array<boolean> = [];
  let statuses: Array<string> = [];
  let collectionIds: Array<string> = [];
  let prices: Array<string> = [];
  let images: Array<string> = [];
  let names: Array<string> = [];

  let design = PrintDesignData.bind(
    Address.fromString("0xCBE04798e01842508B22DcB6d66f7d7D80ccc219")
  );

  for (let i = 0; i < subs.length; i++) {
    amounts.push(order.getSubOrderAmount(subs[i]).toString());
    isFulfilleds.push(order.getSubOrderIsFulfilled(subs[i]));
    prices.push(order.getSubOrderPrice(subs[i]).toString());
    statuses.push(order.getSubOrderStatus(subs[i]).toString());
    const collId = order.getSubOrderCollectionId(subs[i]);

    let entityCollection = CollectionCreated.load(
      Bytes.fromByteArray(ByteArray.fromBigInt(collId))
    );

    if (entityCollection) {
      let orderIds: Array<BigInt> | null = entityCollection.orderIds;
      if (orderIds == null) {
        orderIds = [];
      }
      orderIds.push(event.params.orderId);
      entityCollection.orderIds = orderIds;

      let buyerProfileIds: Array<BigInt> | null =
        entityCollection.buyerProfileIds;
      if (buyerProfileIds == null) {
        buyerProfileIds = [];
      }
      const profileId = order.getOrderBuyerProfileId(event.params.orderId);
      buyerProfileIds.push(profileId);
      entityCollection.buyerProfileIds = buyerProfileIds;

      entityCollection.save();
    }

    collectionIds.push(collId.toString());
    const uri = design.getCollectionURI(collId);

    let ipfsHash = uri.split("/").pop();

    if (ipfsHash != null) {
      let metadata = ipfs.cat(ipfsHash);

      if (metadata) {
        const value = json.fromBytes(metadata).toObject();
        if (value) {
          let image = value.get("images");
          if (image) {
            images.push(
              image.toArray().map<string>((item) => item.toString())[0]
            );
          }

          let title = value.get("title");
          if (title) {
            names.push(title.toString());
          }
        }
      }
    }
  }

  entity.subOrderAmount = amounts;
  entity.subOrderIsFulfilled = isFulfilleds;
  entity.subOrderStatus = statuses;
  entity.subOrderCollectionIds = collectionIds;
  entity.subOrderPrice = prices;
  entity.images = images;
  entity.names = names;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSubOrderIsFulfilled(
  event: SubOrderIsFulfilledEvent
): void {
  let entity = new SubOrderIsFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.subOrderId = event.params.subOrderId;

  let order = PrintOrderData.bind(
    Address.fromString("0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2")
  );

  const orderId = order.getSubOrderOrderId(entity.subOrderId);

  if (orderId !== null) {
    let entityOrder = OrderCreated.load(
      Bytes.fromByteArray(ByteArray.fromBigInt(orderId))
    );

    if (entityOrder) {
      const subs = order.getOrderSubOrders(orderId);
      let index = -1;
      for (let i = 0; i < subs.length; i++) {
        if (subs[i].toString() === entity.subOrderId.toString()) {
          index = i;
          break;
        }
      }

      if (index) {
        let fulfilled: Array<boolean> | null = entityOrder.subOrderIsFulfilled;

        if (!fulfilled) {
          fulfilled = [];
        }
        fulfilled[index] = true;
        entityOrder.subOrderIsFulfilled = fulfilled;
        entityOrder.save();
      }
    }
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateNFTOnlyOrderMessage(
  event: UpdateNFTOnlyOrderMessageEvent
): void {
  let entity = new UpdateNFTOnlyOrderMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.orderId = event.params.orderId;
  entity.newMessageDetails = event.params.newMessageDetails;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let entityOrder = NFTOnlyOrderCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(entity.orderId))
  );

  if (entityOrder != null) {
    let newMessages: Array<string> | null = entityOrder.messages;
    if (newMessages == null) {
      newMessages = [];
    }
    newMessages.push(entity.newMessageDetails);
    entityOrder.messages = newMessages;
    entityOrder.save();
  }

  entity.save();
}

export function handleUpdateOrderDetails(event: UpdateOrderDetailsEvent): void {
  let entity = new UpdateOrderDetails(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.orderId));
  entity.orderId = event.params.orderId;
  entity.newOrderDetails = event.params.newOrderDetails;

  let entityOrder = OrderCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(entity.orderId))
  );

  if (entityOrder) {
    entityOrder.details = entity.newOrderDetails;

    entityOrder.save();
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateOrderMessage(event: UpdateOrderMessageEvent): void {
  let entity = new UpdateOrderMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.orderId));
  entity.orderId = event.params.orderId;
  entity.newMessageDetails = event.params.newMessageDetails;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let entityOrder = OrderCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(entity.orderId))
  );

  if (entityOrder != null) {
    let newMessages: Array<string> | null = entityOrder.messages;
    if (newMessages == null) {
      newMessages = [];
    }
    newMessages.push(entity.newMessageDetails);
    entityOrder.messages = newMessages;
    entityOrder.save();
  }

  entity.save();
}

export function handleUpdateSubOrderStatus(
  event: UpdateSubOrderStatusEvent
): void {
  let entity = new UpdateSubOrderStatus(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.subOrderId = event.params.subOrderId;
  entity.newSubOrderStatus = event.params.newSubOrderStatus;

  let order = PrintOrderData.bind(
    Address.fromString("0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2")
  );

  const orderId = order.getSubOrderOrderId(entity.subOrderId);

  if (orderId !== null) {
    let entityOrder = OrderCreated.load(
      Bytes.fromByteArray(ByteArray.fromBigInt(orderId))
    );

    if (entityOrder) {
      const subs = order.getOrderSubOrders(orderId);
      let index = -1;
      for (let i = 0; i < subs.length; i++) {
        if (subs[i].toString() === entity.subOrderId.toString()) {
          index = i;
          break;
        }
      }
      if (index) {
        let statuses = entityOrder.subOrderStatus;
        if (!statuses) {
          statuses = [];
        }
        statuses[index] = entity.newSubOrderStatus.toString();
        entityOrder.subOrderStatus = statuses;
        entityOrder.save();
      }
    }
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
