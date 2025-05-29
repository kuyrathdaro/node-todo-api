import { Service, Inject } from "typedi";
import { ITodoInputDTO } from "@/interfaces/ITodo";
import { Logger } from "winston";
import { UserModel } from "@/models/user";
import { TodoModel } from "@/models/todo";

@Service()
export default class TodoService {
  constructor(
    @Inject("todoModel") private todoModel: TodoModel,
    @Inject("userModel") private userModel: UserModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async createTodo(
    userId: string,
    todoInputDTO: ITodoInputDTO
  ): Promise<any> {
    try {
      this.logger.silly("Creating a todo list");
      const todoRecord: any = await this.todoModel.create({ ...todoInputDTO });
      if (!todoRecord) {
        throw new Error("Error creating a todo");
      }
      const userRecord = await this.userModel.updateOne(
        { _id: userId },
        { $push: { todos: todoRecord._id } }
      );
      if (!userRecord) {
        throw new Error("Error pushing todo to user");
      }
      if (todoRecord && userRecord) {
        return todoRecord;
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getAllTodos(userId: string): Promise<any> {
    try {
      const todos: any = await this.userModel
        .findOne({ _id: userId })
        .populate("todos")
        .select("todos -_id")
        .exec();
      return todos;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getTodoById(userId: string, todoId: string): Promise<any> {
    try {
      const userRecord: any = await this.userModel.findOne({ _id: userId });
      if (userRecord.todos.includes(todoId)) {
        const todoRecord = await this.todoModel.findOne({ _id: todoId });
        return todoRecord.toObject();
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async updateTodo(
    userId: string,
    todoId: string,
    todoInputDTO: ITodoInputDTO
  ): Promise<any> {
    try {
      this.logger.silly("Updating a todo list");
      const userRecord: any = await this.userModel.findOne({ _id: userId });
      if (userRecord.todos.includes(todoId)) {
        const updatedTodo = await this.todoModel.updateOne(
          { _id: todoId },
          { $set: { ...todoInputDTO } },
          { new: true }
        );
        if (!updatedTodo) {
          throw new Error("Error updating todo");
        } else {
          return updatedTodo;
        }
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async deleteTodo(userId: string, todoId: string): Promise<any> {
    try {
      let userRecord: any = await this.userModel.findOne({ _id: userId });
      if (userRecord.todos.includes(todoId)) {
        const deletedTodo = await this.todoModel.findOneAndDelete({ _id: todoId});
        this.userModel.updateOne({ "todos": todoId }, { $pull: { "todos": todoId}});
        return deletedTodo;
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
