import {
  Bytes,
  JSONValueKind,
  dataSource,
  json,
  log,
} from "@graphprotocol/graph-ts";
import {
  CollectionMetadata,
  CommunityMetadata,
  DropMetadata,
} from "../generated/schema";

export function handleCommunityMetadata(content: Bytes): void {
  let metadata = new CommunityMetadata(dataSource.stringParam());
  const value = json.fromString(content.toString()).toObject();
  if (value) {
    // let subTopic = value.get("subTopic");
    // if (subTopic) {
    //   metadata.subTopic = subTopic.toString().substring(0, 2000);
    // }
    // let cover = value.get("cover");
    // if (cover) {
    //   metadata.cover = cover.toString();
    // }
    // let name = value.get("name");
    // if (name) {
    //   metadata.name = name.toString();
    // }
    // let description = value.get("description");
    // if (description) {
    //   metadata.description = description.toString().substring(0, 2000);
    // }
    // metadata.save();
  }
}

export function handleCollectionMetadata(content: Bytes): void {
  let metadata = new CollectionMetadata(dataSource.stringParam());
  const value = json.fromString(content.toString()).toObject();
  if (value) {
    let images = value.get("images");
    if (images && images.kind === JSONValueKind.ARRAY) {
      metadata.images = images
        .toArray()
        .filter(
          (item) =>
            item.kind === JSONValueKind.STRING &&
            !item.toString().includes("base64")
        )
        .map<string>((item) => item.toString());
    }
    let video = value.get("video");
    if (
      video &&
      video.kind === JSONValueKind.STRING &&
      !video.toString().includes("base64")
    ) {
      metadata.video = video.toString();
    }
    let audio = value.get("audio");
    if (
      audio &&
      audio.kind === JSONValueKind.STRING &&
      !audio.toString().includes("base64")
    ) {
      metadata.audio = audio.toString();
    }
    let mediaCover = value.get("cover");
    if (
      mediaCover &&
      mediaCover.kind === JSONValueKind.STRING &&
      !mediaCover.toString().includes("base64")
    ) {
      metadata.mediaCover = mediaCover.toString();
    }
    let description = value.get("description");
    if (description && description.kind === JSONValueKind.STRING) {
      metadata.description = description.toString().substring(0, 2000);
    }
    let title = value.get("title");
    if (title && title.kind === JSONValueKind.STRING) {
      metadata.title = title.toString();
    }
    let tags = value.get("tags");
    if (tags && tags.kind === JSONValueKind.ARRAY) {
      metadata.tags = tags
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString())
        .join(", ");
    }
    let prompt = value.get("prompt");
    if (prompt && prompt.kind === JSONValueKind.STRING) {
      metadata.prompt = prompt.toString().substring(0, 2000);
    }
    let sizes = value.get("sizes");
    if (sizes && sizes.kind === JSONValueKind.ARRAY) {
      metadata.sizes = sizes
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString())
        .join(", ");
    }
    let colors = value.get("colors");
    if (colors && colors.kind === JSONValueKind.ARRAY) {
      metadata.colors = colors
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString())
        .join(", ");
    }
    let profileHandle = value.get("profileHandle");
    if (profileHandle && profileHandle.kind === JSONValueKind.STRING) {
      metadata.profileHandle = profileHandle.toString();
    }
    let microbrandCover = value.get("microbrandCover");
    if (
      microbrandCover &&
      microbrandCover.kind === JSONValueKind.STRING &&
      !microbrandCover.toString().includes("base64")
    ) {
      metadata.microbrandCover = microbrandCover.toString();
    }
    let microbrand = value.get("microbrand");
    if (microbrand && microbrand.kind === JSONValueKind.STRING) {
      metadata.microbrand = microbrand.toString();
    }
    let visibility = value.get("visibility");
    if (visibility && visibility.kind === JSONValueKind.STRING) {
      metadata.visibility = visibility.toString();
    }
    let style = value.get("style");
    if (style && style.kind === JSONValueKind.STRING) {
      metadata.style = style.toString();
    }
    let sex = value.get("sex");
    if (sex && sex.kind === JSONValueKind.STRING) {
      metadata.sex = sex.toString();
    }
    let communities = value.get("communities");
    if (communities && communities.kind === JSONValueKind.ARRAY) {
      metadata.communities = communities
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString())
        .join(", ");
    }
    let access = value.get("access");
    if (access && access.kind === JSONValueKind.ARRAY) {
      metadata.access = access
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString())
        .join(", ");
    }
    let mediaTypes = value.get("mediaTypes");
    if (mediaTypes && mediaTypes.kind === JSONValueKind.ARRAY) {
      metadata.mediaTypes = mediaTypes
        .toArray()
        .filter((item) => item.kind === JSONValueKind.STRING)
        .map<string>((item) => item.toString())
        .join(", ");
    }
    metadata.save();
  }
}

export function handleDropMetadata(content: Bytes): void {
  let metadata = new DropMetadata(dataSource.stringParam());
  const value = json.fromString(content.toString()).toObject();
  if (value) {
    let cover = value.get("cover");
    if (
      cover !== null &&
      cover.kind === JSONValueKind.STRING &&
      !cover.toString().includes("base64")
    ) {
      metadata.dropCover = cover.toString();
    }

    let title = value.get("title");
    if (title !== null && title.kind === JSONValueKind.STRING) {
      metadata.dropTitle = title.toString();
    }
    metadata.save();
  }
}
