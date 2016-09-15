import { instantiate } from 'esmvc';
import TodoFormController from 'controller/TodoForm';
import TodoListController from 'controller/TodoList';

instantiate([TodoFormController, TodoListController]);