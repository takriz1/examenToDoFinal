import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';

export interface TodoList {
  id: number;
  task: string;
  description:string;
  completed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  tasks: TodoList[] = [];
  isEditing: boolean = false;
  taskForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      newTask: ['', Validators.required],
      taskDesc: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.loadTasksFromLocalStorage();
  }
  addTask(): void {
    if (this.taskForm.valid) {
      const newTaskValue = this.taskForm.get('newTask')?.value;
      const descriptionValue = this.taskForm.get('taskDesc')?.value;
      const newTaskObj: TodoList = {
        id: this.tasks.length + 1,
        task: newTaskValue,
        description: descriptionValue,
        completed: false,
        createdAt: new Date(),
      };
      this.tasks.push(newTaskObj);
      this.taskForm.reset();
    }
  }
  onTaskStatusChange(task: TodoList) {
    task.completed = !task.completed; // Toggle boolean value directly
    this.saveTasksToLocalStorage();
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }
 
  delete(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasksToLocalStorage();
  }
}

