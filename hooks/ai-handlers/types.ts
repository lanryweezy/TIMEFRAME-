import { VideoState, ToolArgs } from '../../types';

export interface HandlerContext {
  store: any;
  state: VideoState;
  proposeAction: (toolName: string, args: any, description: string, stateUpdate: Partial<VideoState>) => void;
}

export type ToolHandler = (args: ToolArgs, context: HandlerContext) => Promise<any> | any;
