import {
  Bytes,
  JSONValueKind,
  dataSource,
  json,
  log,
} from "@graphprotocol/graph-ts";
import { GrantMetadata } from "../generated/schema";

export function handleGrantMetadata(content: Bytes): void {
  let metadata = new GrantMetadata(dataSource.stringParam());
  const value = json.fromString(content.toString()).toObject();
  if (value) {
    let milestones = value.get("milestones");
    if (milestones && milestones.kind === JSONValueKind.ARRAY) {
      metadata.milestones = milestones
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString());
    }
    let title = value.get("title");
    if (title && title.kind === JSONValueKind.STRING) {
      metadata.title = title.toString();
    }
    let description = value.get("description");
    if (description && description.kind === JSONValueKind.STRING) {
      metadata.description = description.toString();
    }
    let team = value.get("team");
    if (team && team.kind === JSONValueKind.STRING) {
      metadata.team = team.toString();
    }
    let experience = value.get("experience");
    if (experience && experience.kind === JSONValueKind.STRING) {
      metadata.experience = experience.toString();
    }
    let tech = value.get("tech");
    if (tech && tech.kind === JSONValueKind.STRING) {
      metadata.tech = tech.toString();
    }
    let strategy = value.get("strategy");
    if (strategy && strategy.kind === JSONValueKind.STRING) {
      metadata.strategy = strategy.toString();
    }
    let cover = value.get("cover");
    if (cover && cover.kind === JSONValueKind.STRING) {
      metadata.cover = cover.toString();
    }

    metadata.save();
  }
}
