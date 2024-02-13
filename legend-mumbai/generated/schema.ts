// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class AllClaimedMilestone extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AllClaimedMilestone entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type AllClaimedMilestone must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("AllClaimedMilestone", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): AllClaimedMilestone | null {
    return changetype<AllClaimedMilestone | null>(
      store.get("AllClaimedMilestone", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get grantId(): BigInt {
    let value = this.get("grantId");
    return value!.toBigInt();
  }

  set grantId(value: BigInt) {
    this.set("grantId", Value.fromBigInt(value));
  }

  get milestone(): i32 {
    let value = this.get("milestone");
    return value!.toI32();
  }

  set milestone(value: i32) {
    this.set("milestone", Value.fromI32(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class GrantCreated extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantCreated entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type GrantCreated must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("GrantCreated", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): GrantCreated | null {
    return changetype<GrantCreated | null>(
      store.get("GrantCreated", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get grantId(): BigInt {
    let value = this.get("grantId");
    return value!.toBigInt();
  }

  set grantId(value: BigInt) {
    this.set("grantId", Value.fromBigInt(value));
  }

  get creator(): Bytes {
    let value = this.get("creator");
    return value!.toBytes();
  }

  set creator(value: Bytes) {
    this.set("creator", Value.fromBytes(value));
  }

  get pubId(): BigInt {
    let value = this.get("pubId");
    return value!.toBigInt();
  }

  set pubId(value: BigInt) {
    this.set("pubId", Value.fromBigInt(value));
  }

  get profileId(): BigInt {
    let value = this.get("profileId");
    return value!.toBigInt();
  }

  set profileId(value: BigInt) {
    this.set("profileId", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }

  get levelInfo(): Array<string> {
    let value = this.get("levelInfo");
    return value!.toStringArray();
  }

  set levelInfo(value: Array<string>) {
    this.set("levelInfo", Value.fromStringArray(value));
  }

  get milestones(): Array<string> {
    let value = this.get("milestones");
    return value!.toStringArray();
  }

  set milestones(value: Array<string>) {
    this.set("milestones", Value.fromStringArray(value));
  }

  get acceptedCurrencies(): Array<Bytes> {
    let value = this.get("acceptedCurrencies");
    return value!.toBytesArray();
  }

  set acceptedCurrencies(value: Array<Bytes>) {
    this.set("acceptedCurrencies", Value.fromBytesArray(value));
  }

  get granteeAddresses(): Array<Bytes> {
    let value = this.get("granteeAddresses");
    return value!.toBytesArray();
  }

  set granteeAddresses(value: Array<Bytes>) {
    this.set("granteeAddresses", Value.fromBytesArray(value));
  }

  get splits(): Array<BigInt> {
    let value = this.get("splits");
    return value!.toBigIntArray();
  }

  set splits(value: Array<BigInt>) {
    this.set("splits", Value.fromBigIntArray(value));
  }

  get uri(): string {
    let value = this.get("uri");
    return value!.toString();
  }

  set uri(value: string) {
    this.set("uri", Value.fromString(value));
  }

  get grantMetadata(): string | null {
    let value = this.get("grantMetadata");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set grantMetadata(value: string | null) {
    if (!value) {
      this.unset("grantMetadata");
    } else {
      this.set("grantMetadata", Value.fromString(<string>value));
    }
  }

  get fundedAmount(): Array<string> | null {
    let value = this.get("fundedAmount");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set fundedAmount(value: Array<string> | null) {
    if (!value) {
      this.unset("fundedAmount");
    } else {
      this.set("fundedAmount", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class GrantDeleted extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantDeleted entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type GrantDeleted must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("GrantDeleted", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): GrantDeleted | null {
    return changetype<GrantDeleted | null>(
      store.get("GrantDeleted", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get grantId(): BigInt {
    let value = this.get("grantId");
    return value!.toBigInt();
  }

  set grantId(value: BigInt) {
    this.set("grantId", Value.fromBigInt(value));
  }

  get deleter(): Bytes {
    let value = this.get("deleter");
    return value!.toBytes();
  }

  set deleter(value: Bytes) {
    this.set("deleter", Value.fromBytes(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class GrantFunded extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantFunded entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type GrantFunded must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("GrantFunded", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): GrantFunded | null {
    return changetype<GrantFunded | null>(
      store.get("GrantFunded", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get currency(): Bytes {
    let value = this.get("currency");
    return value!.toBytes();
  }

  set currency(value: Bytes) {
    this.set("currency", Value.fromBytes(value));
  }

  get grantId(): BigInt {
    let value = this.get("grantId");
    return value!.toBigInt();
  }

  set grantId(value: BigInt) {
    this.set("grantId", Value.fromBigInt(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class MilestoneClaimed extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save MilestoneClaimed entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type MilestoneClaimed must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("MilestoneClaimed", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): MilestoneClaimed | null {
    return changetype<MilestoneClaimed | null>(
      store.get("MilestoneClaimed", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get claimer(): Bytes {
    let value = this.get("claimer");
    return value!.toBytes();
  }

  set claimer(value: Bytes) {
    this.set("claimer", Value.fromBytes(value));
  }

  get milestone(): i32 {
    let value = this.get("milestone");
    return value!.toI32();
  }

  set milestone(value: i32) {
    this.set("milestone", Value.fromI32(value));
  }

  get grantId(): BigInt {
    let value = this.get("grantId");
    return value!.toBigInt();
  }

  set grantId(value: BigInt) {
    this.set("grantId", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class MilestoneStatusUpdated extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save MilestoneStatusUpdated entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type MilestoneStatusUpdated must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("MilestoneStatusUpdated", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): MilestoneStatusUpdated | null {
    return changetype<MilestoneStatusUpdated | null>(
      store.get("MilestoneStatusUpdated", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get updater(): Bytes {
    let value = this.get("updater");
    return value!.toBytes();
  }

  set updater(value: Bytes) {
    this.set("updater", Value.fromBytes(value));
  }

  get grantId(): BigInt {
    let value = this.get("grantId");
    return value!.toBigInt();
  }

  set grantId(value: BigInt) {
    this.set("grantId", Value.fromBigInt(value));
  }

  get milestone(): i32 {
    let value = this.get("milestone");
    return value!.toI32();
  }

  set milestone(value: i32) {
    this.set("milestone", Value.fromI32(value));
  }

  get status(): i32 {
    let value = this.get("status");
    return value!.toI32();
  }

  set status(value: i32) {
    this.set("status", Value.fromI32(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    return value!.toBigInt();
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    return value!.toBytes();
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class Milestone extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Milestone entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Milestone must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Milestone", id.toString(), this);
    }
  }

  static load(id: string): Milestone | null {
    return changetype<Milestone | null>(store.get("Milestone", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get currencyGoal(): Array<string> | null {
    let value = this.get("currencyGoal");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set currencyGoal(value: Array<string> | null) {
    if (!value) {
      this.unset("currencyGoal");
    } else {
      this.set("currencyGoal", Value.fromStringArray(<Array<string>>value));
    }
  }

  get granteeClaimed(): Array<boolean> | null {
    let value = this.get("granteeClaimed");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBooleanArray();
    }
  }

  set granteeClaimed(value: Array<boolean> | null) {
    if (!value) {
      this.unset("granteeClaimed");
    } else {
      this.set("granteeClaimed", Value.fromBooleanArray(<Array<boolean>>value));
    }
  }

  get submitBy(): BigInt {
    let value = this.get("submitBy");
    return value!.toBigInt();
  }

  set submitBy(value: BigInt) {
    this.set("submitBy", Value.fromBigInt(value));
  }

  get status(): BigInt {
    let value = this.get("status");
    return value!.toBigInt();
  }

  set status(value: BigInt) {
    this.set("status", Value.fromBigInt(value));
  }

  get allClaimed(): boolean {
    let value = this.get("allClaimed");
    return value!.toBoolean();
  }

  set allClaimed(value: boolean) {
    this.set("allClaimed", Value.fromBoolean(value));
  }
}

export class LevelInfo extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save LevelInfo entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type LevelInfo must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("LevelInfo", id.toString(), this);
    }
  }

  static load(id: string): LevelInfo | null {
    return changetype<LevelInfo | null>(store.get("LevelInfo", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collectionIds(): Array<BigInt> | null {
    let value = this.get("collectionIds");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set collectionIds(value: Array<BigInt> | null) {
    if (!value) {
      this.unset("collectionIds");
    } else {
      this.set("collectionIds", Value.fromBigIntArray(<Array<BigInt>>value));
    }
  }

  get amounts(): Array<BigInt> | null {
    let value = this.get("amounts");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set amounts(value: Array<BigInt> | null) {
    if (!value) {
      this.unset("amounts");
    } else {
      this.set("amounts", Value.fromBigIntArray(<Array<BigInt>>value));
    }
  }

  get level(): BigInt {
    let value = this.get("level");
    return value!.toBigInt();
  }

  set level(value: BigInt) {
    this.set("level", Value.fromBigInt(value));
  }
}

export class GrantMetadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantMetadata entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type GrantMetadata must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("GrantMetadata", id.toString(), this);
    }
  }

  static load(id: string): GrantMetadata | null {
    return changetype<GrantMetadata | null>(store.get("GrantMetadata", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string | null {
    let value = this.get("title");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (!value) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(<string>value));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (!value) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(<string>value));
    }
  }

  get team(): string | null {
    let value = this.get("team");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set team(value: string | null) {
    if (!value) {
      this.unset("team");
    } else {
      this.set("team", Value.fromString(<string>value));
    }
  }

  get tech(): string | null {
    let value = this.get("tech");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tech(value: string | null) {
    if (!value) {
      this.unset("tech");
    } else {
      this.set("tech", Value.fromString(<string>value));
    }
  }

  get strategy(): string | null {
    let value = this.get("strategy");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set strategy(value: string | null) {
    if (!value) {
      this.unset("strategy");
    } else {
      this.set("strategy", Value.fromString(<string>value));
    }
  }

  get cover(): string | null {
    let value = this.get("cover");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set cover(value: string | null) {
    if (!value) {
      this.unset("cover");
    } else {
      this.set("cover", Value.fromString(<string>value));
    }
  }

  get experience(): string | null {
    let value = this.get("experience");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set experience(value: string | null) {
    if (!value) {
      this.unset("experience");
    } else {
      this.set("experience", Value.fromString(<string>value));
    }
  }

  get milestones(): Array<string> | null {
    let value = this.get("milestones");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set milestones(value: Array<string> | null) {
    if (!value) {
      this.unset("milestones");
    } else {
      this.set("milestones", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class CurrencyGoal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save CurrencyGoal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CurrencyGoal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("CurrencyGoal", id.toString(), this);
    }
  }

  static load(id: string): CurrencyGoal | null {
    return changetype<CurrencyGoal | null>(store.get("CurrencyGoal", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get currency(): Bytes {
    let value = this.get("currency");
    return value!.toBytes();
  }

  set currency(value: Bytes) {
    this.set("currency", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}


export class Funded extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Funded entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Funded must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Funded", id.toString(), this);
    }
  }

  static load(id: string): Funded | null {
    return changetype<Funded | null>(store.get("Funded", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get currency(): Bytes {
    let value = this.get("currency");
    return value!.toBytes();
  }

  set currency(value: Bytes) {
    this.set("currency", Value.fromBytes(value));
  }

  get funded(): BigInt {
    let value = this.get("funded");
    return value!.toBigInt();
  }

  set funded(value: BigInt) {
    this.set("funded", Value.fromBigInt(value));
  }
}
