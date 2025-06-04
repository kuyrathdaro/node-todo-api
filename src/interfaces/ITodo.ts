export interface ITodo {
    _id: string;
    title: string;
    description: string;
    status?: boolean;
    user: string; // Reference to the user who created the todo
}

export interface ITodoInputDTO {
    title: string;
    description: string;
    status?: boolean;
    user?: string; // Optional, will be set to the current user's ID when creating a todo
}