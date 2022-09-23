export interface IResult {
 code: number;
 message: string;
}

export interface IPage {
 page: number;
 total: number;
 page_size: number;
}

export interface IListWorkspaceResponse<T> {
 code: number;
 message: string;
 data: {
   list: T[];
   pagination: IPage;
 };
}
// Workspace
export interface IWorkspaceResponse<T> {
 code: number;
 data: T;
 message: string;
}

export type IStatus = 'WAITING' | 'DOING' | 'SUCCESS' | 'FAILED';

export interface CommonListResponse<T> extends IResult {
 data: {
   list: T[];
   pagination: IPage;
 };
}

export interface CommonResponse<T> extends IResult {
 data: T
}
