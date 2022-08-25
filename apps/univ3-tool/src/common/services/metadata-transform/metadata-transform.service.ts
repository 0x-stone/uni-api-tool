import { Metadata } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import protobuf from 'protobufjs';

interface ImessageMeta {
  requestRecvTimeE6: number;
  responseTimeE6: number;
}

const METADATA_RES_KEY = 'next-response-metadata-bin';
const METADATA_REQ_KEY = 'next-request-metadata-bin';

@Injectable()
export class MetadataTransformService {
  private GWResponseMetadata;
  private GWRequestMetadata;
  constructor() {
    const root = protobuf.loadSync(join(__dirname, 'gw-metadata.proto'));
    this.GWResponseMetadata = root.lookupType('GWResponseMetadata');
    this.GWRequestMetadata = root.lookupType('GWRequestMetadata');
  }
  private _gwResMetadata2buffer(messageMeta: ImessageMeta): Buffer {
    const message = this.GWResponseMetadata.create(messageMeta);
    return this.GWResponseMetadata.encode(message).finish();
  }

  public genGwResMetadata(messageMeta: ImessageMeta): Metadata {
    const resMetadata = new Metadata();
    resMetadata.add(METADATA_RES_KEY, this._gwResMetadata2buffer(messageMeta));
    return resMetadata;
  }

  public decodeGwReqMetadata(metadata: Metadata) {
    if (metadata.get(METADATA_REQ_KEY).length === 0) {
      return {};
    }
    return this._gwResFromBuffer(metadata.get(METADATA_REQ_KEY)[0] as Buffer);
  }

  public _gwResFromBuffer(buffer: Buffer) {
    return this.GWRequestMetadata.decode(buffer);
  }
}
