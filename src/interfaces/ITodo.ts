export interface ITodo {
    _id: string;
    title: string;
    description: string;
    status: boolean;
}

export interface ITodoInputDTO {
    title: string;
    description: string;
    status: boolean;
}