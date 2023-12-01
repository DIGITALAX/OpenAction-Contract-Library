// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import { DataSourceTemplate, DataSourceContext } from "@graphprotocol/graph-ts";

export class CollectionMetadata extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("CollectionMetadata", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("CollectionMetadata", [cid], context);
  }
}

export class DropMetadata extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("DropMetadata", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("DropMetadata", [cid], context);
  }
}

export class CommunityMetadata extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("CommunityMetadata", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("CommunityMetadata", [cid], context);
  }
}
