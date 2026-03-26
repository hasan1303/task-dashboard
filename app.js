const defaultTasks = [
  {
    id: 1,
    title: "Design dashboard layout",
    description: "Create a clean dashboard structure with cards, spacing and better hierarchy.",
    priority: "High",
    date: "2026-03-30",
    status: "In Progress"
  },
  {
    id: 2,
    title: "Implement search and filters",
    description: "Allow users to search tasks and filter by status and sorting options.",
    priority: "Medium",
    date: "2026-04-01",
    status: "Pending"
  },
  {
    id: 3,
    title: "Connect localStorage",
    description: "Persist tasks and theme settings in localStorage for better usability.",
    priority: "Low",
    date: "2026-04-03",
    status: "Completed"
  }
];

const taskStore = Vue.observable({
  tasks: JSON.parse(localStorage.getItem("tasks")) || defaultTasks,
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
});

const Dashboard = {
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track performance, progress and deadlines in one place.</p>
        </div>

        <router-link to="/add">
          <button class="primary-btn">+ Add New Task</button>
        </router-link>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-label">Total Tasks</span>
            <span>📋</span>
          </div>
          <div class="stat-value">{{ totalTasks }}</div>
          <div class="stat-subtext">All created tasks</div>
        </div>

        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-label">Completed</span>
            <span>✅</span>
          </div>
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-subtext">{{ completionRate }}% completion rate</div>
        </div>

        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-label">Pending</span>
            <span>⏳</span>
          </div>
          <div class="stat-value">{{ pendingTasks }}</div>
          <div class="stat-subtext">Still waiting to be done</div>
        </div>

        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-label">Overdue</span>
            <span>⚠️</span>
          </div>
          <div class="stat-value">{{ overdueTasks.length }}</div>
          <div class="stat-subtext">Need immediate attention</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="panel">
          <h3>Project Progress</h3>
          <p>{{ completedTasks }} of {{ totalTasks }} tasks completed</p>

          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: completionRate + '%' }"></div>
            </div>
          </div>

          <div class="info-list" style="margin-top: 20px;">
            <div class="info-row">
              <span>High Priority</span>
              <strong>{{ highPriorityTasks }}</strong>
            </div>
            <div class="info-row">
              <span>In Progress</span>
              <strong>{{ inProgressTasks }}</strong>
            </div>
            <div class="info-row">
              <span>Due Today</span>
              <strong>{{ todayTasks.length }}</strong>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>Quick Overview</h3>
          <div class="quick-list">
            <div class="quick-item">
              <strong>Today's Tasks</strong>
              <span>{{ todayTasks.length }} task(s) due today</span>
            </div>
            <div class="quick-item">
              <strong>Upcoming</strong>
              <span>{{ upcomingTasks.length }} task(s) coming next</span>
            </div>
            <div class="quick-item">
              <strong>Need Attention</strong>
              <span>{{ overdueTasks.length }} overdue task(s)</span>
            </div>
          </div>
        </div>
      </div>

      <h2 class="section-title">Recent Tasks</h2>

      <div v-if="recentTasks.length" class="task-list">
        <div
          class="task-item"
          :class="task.priority.toLowerCase() + '-priority'"
          v-for="task in recentTasks"
          :key="task.id"
        >
          <div class="task-top">
            <div>
              <h3 class="task-title">{{ task.title }}</h3>
              <p class="task-desc">{{ task.description }}</p>
            </div>

            <span class="badge" :class="task.priority.toLowerCase()">
              {{ task.priority }}
            </span>
          </div>

          <div class="task-meta">
            <span class="status-pill">{{ task.status }}</span>
            <span class="status-pill">Due: {{ task.date }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <h3>No tasks yet</h3>
        <p>Start by creating your first task.</p>
      </div>
    </div>
  `,
  computed: {
    tasks() {
      return taskStore.tasks;
    },
    totalTasks() {
      return this.tasks.length;
    },
    completedTasks() {
      return this.tasks.filter(task => task.status === "Completed").length;
    },
    pendingTasks() {
      return this.tasks.filter(task => task.status === "Pending").length;
    },
    inProgressTasks() {
      return this.tasks.filter(task => task.status === "In Progress").length;
    },
    highPriorityTasks() {
      return this.tasks.filter(task => task.priority === "High").length;
    },
    completionRate() {
      if (!this.totalTasks) return 0;
      return Math.round((this.completedTasks / this.totalTasks) * 100);
    },
    todayTasks() {
      const today = new Date().toISOString().split("T")[0];
      return this.tasks.filter(task => task.date === today);
    },
    upcomingTasks() {
      const today = new Date().toISOString().split("T")[0];
      return this.tasks.filter(task => task.date > today && task.status !== "Completed").slice(0, 5);
    },
    overdueTasks() {
      const today = new Date().toISOString().split("T")[0];
      return this.tasks.filter(task => task.date < today && task.status !== "Completed");
    },
    recentTasks() {
      return [...this.tasks].slice(-4).reverse();
    }
  }
};

const AllTasks = {
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1>All Tasks</h1>
          <p>Search, filter and manage your tasks easily.</p>
        </div>

        <router-link to="/add">
          <button class="primary-btn">+ New Task</button>
        </router-link>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <input
            class="search-input"
            v-model="search"
            placeholder="Search by title or description..."
          />

          <select class="select-input" v-model="sortBy">
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        <div class="toolbar-right">
          <div class="tabs">
            <button class="tab-btn" :class="{ active: statusFilter === 'All' }" @click="statusFilter = 'All'">All</button>
            <button class="tab-btn" :class="{ active: statusFilter === 'Pending' }" @click="statusFilter = 'Pending'">Pending</button>
            <button class="tab-btn" :class="{ active: statusFilter === 'In Progress' }" @click="statusFilter = 'In Progress'">In Progress</button>
            <button class="tab-btn" :class="{ active: statusFilter === 'Completed' }" @click="statusFilter = 'Completed'">Completed</button>
          </div>
        </div>
      </div>

      <div v-if="filteredTasks.length" class="task-list">
        <div
          class="task-item"
          :class="task.priority.toLowerCase() + '-priority'"
          v-for="task in filteredTasks"
          :key="task.id"
        >
          <div class="task-top">
            <div>
              <h3 class="task-title">{{ task.title }}</h3>
              <p class="task-desc">{{ task.description }}</p>
            </div>

            <span class="badge" :class="task.priority.toLowerCase()">
              {{ task.priority }}
            </span>
          </div>

          <div class="task-meta">
            <span class="status-pill">{{ task.status }}</span>
            <span class="status-pill">Due: {{ task.date }}</span>
          </div>

          <div class="task-actions">
            <router-link :to="'/task/' + task.id">
              <button class="secondary-btn">View / Edit</button>
            </router-link>

            <button
              class="primary-btn"
              v-if="task.status !== 'Completed'"
              @click="markCompleted(task.id)"
            >
              Mark Completed
            </button>

            <button class="danger-btn" @click="deleteTask(task.id)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <h3>No matching tasks</h3>
        <p>Try another search or change the filter.</p>
      </div>
    </div>
  `,
  data() {
    return {
      search: "",
      statusFilter: "All",
      sortBy: "date"
    };
  },
  computed: {
    filteredTasks() {
      let tasks = [...taskStore.tasks];

      if (this.search.trim()) {
        const term = this.search.toLowerCase();
        tasks = tasks.filter(task =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
        );
      }

      if (this.statusFilter !== "All") {
        tasks = tasks.filter(task => task.status === this.statusFilter);
      }

      if (this.sortBy === "date") {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (this.sortBy === "priority") {
        const order = { High: 1, Medium: 2, Low: 3 };
        tasks.sort((a, b) => order[a.priority] - order[b.priority]);
      } else if (this.sortBy === "title") {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
      }

      return tasks;
    }
  },
  methods: {
    markCompleted(id) {
      const task = taskStore.tasks.find(task => task.id === id);
      if (task) {
        task.status = "Completed";
        taskStore.saveTasks();
      }
    },
    deleteTask(id) {
      const confirmed = confirm("Are you sure you want to delete this task?");
      if (!confirmed) return;
      taskStore.tasks = taskStore.tasks.filter(task => task.id !== id);
      taskStore.saveTasks();
    }
  }
};

const AddTask = {
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1>Add Task</h1>
          <p>Create a new task and organize your workflow.</p>
        </div>
      </div>

      <div class="form-layout">
        <div class="form-panel">
          <form class="form-grid" @submit.prevent="addTask">
            <input
              class="form-input"
              v-model="title"
              type="text"
              placeholder="Task title"
              required
            />

            <textarea
              class="form-textarea"
              v-model="description"
              placeholder="Task description"
              required
            ></textarea>

            <select class="form-input" v-model="priority" required>
              <option disabled value="">Select priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input class="form-input" v-model="date" type="date" required />

            <select class="form-input" v-model="status" required>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <button class="primary-btn" type="submit">Save Task</button>
          </form>
        </div>

        <div class="preview-panel">
          <h3>Live Preview</h3>

          <div class="preview-box">
            <h4>{{ title || 'Untitled Task' }}</h4>
            <p class="task-desc">
              {{ description || 'Your task description preview will appear here...' }}
            </p>

            <div class="task-meta" style="margin-top:16px;">
              <span v-if="priority" class="badge" :class="priority.toLowerCase()">
                {{ priority }}
              </span>
              <span class="status-pill">{{ status }}</span>
              <span class="status-pill">{{ date || 'No due date yet' }}</span>
            </div>
          </div>

          <div class="info-list" style="margin-top: 18px;">
            <div class="info-row">
              <span>Validation</span>
              <strong>{{ isFormValid ? 'Ready' : 'Incomplete' }}</strong>
            </div>
            <div class="info-row">
              <span>Priority</span>
              <strong>{{ priority || '-' }}</strong>
            </div>
            <div class="info-row">
              <span>Status</span>
              <strong>{{ status }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      title: "",
      description: "",
      priority: "",
      date: "",
      status: "Pending"
    };
  },
  computed: {
    isFormValid() {
      return this.title && this.description && this.priority && this.date && this.status;
    }
  },
  methods: {
    addTask() {
      const newTask = {
        id: Date.now(),
        title: this.title,
        description: this.description,
        priority: this.priority,
        date: this.date,
        status: this.status
      };

      taskStore.tasks.push(newTask);
      taskStore.saveTasks();
      this.$router.push("/tasks");
    }
  }
};

const TaskDetails = {
  template: `
    <div v-if="task">
      <div class="page-header">
        <div>
          <h1>Task Details</h1>
          <p>Edit task information or remove it.</p>
        </div>
      </div>

      <div class="form-layout">
        <div class="form-panel">
          <div class="form-grid">
            <input class="form-input" v-model="task.title" />
            <textarea class="form-textarea" v-model="task.description"></textarea>

            <select class="form-input" v-model="task.priority">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input class="form-input" type="date" v-model="task.date" />

            <select class="form-input" v-model="task.status">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div class="task-actions">
              <button class="primary-btn" @click="saveTask">Save Changes</button>
              <button class="danger-btn" @click="deleteTask">Delete Task</button>
            </div>
          </div>
        </div>

        <div class="preview-panel">
          <h3>Task Summary</h3>

          <div class="preview-box">
            <h4>{{ task.title }}</h4>
            <p class="task-desc">{{ task.description }}</p>

            <div class="task-meta" style="margin-top:16px;">
              <span class="badge" :class="task.priority.toLowerCase()">
                {{ task.priority }}
              </span>
              <span class="status-pill">{{ task.status }}</span>
              <span class="status-pill">Due: {{ task.date }}</span>
            </div>
          </div>

          <div class="info-list" style="margin-top: 18px;">
            <div class="info-row">
              <span>Task ID</span>
              <strong>#{{ task.id }}</strong>
            </div>
            <div class="info-row">
              <span>Priority</span>
              <strong>{{ task.priority }}</strong>
            </div>
            <div class="info-row">
              <span>Status</span>
              <strong>{{ task.status }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h3>Task not found</h3>
      <p>This task may have been removed.</p>
    </div>
  `,
  computed: {
    task() {
      return taskStore.tasks.find(task => task.id == this.$route.params.id);
    }
  },
  methods: {
    saveTask() {
      taskStore.saveTasks();
      this.$router.push("/tasks");
    },
    deleteTask() {
      const confirmed = confirm("Are you sure you want to delete this task?");
      if (!confirmed) return;
      taskStore.tasks = taskStore.tasks.filter(task => task.id != this.$route.params.id);
      taskStore.saveTasks();
      this.$router.push("/tasks");
    }
  }
};

const Board = {
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1>Task Board</h1>
          <p>Drag tasks between columns to update their status.</p>
        </div>

        <router-link to="/add">
          <button class="primary-btn">+ Add New Task</button>
        </router-link>
      </div>

      <div class="board">
        <div class="board-column">
          <div class="board-column-header">
            <h3>Pending</h3>
            <span class="column-count">{{ pendingTasks.length }}</span>
          </div>

          <div
            class="drop-zone"
            :class="{ 'drag-over': dragOverColumn === 'Pending' }"
            @dragover.prevent="onDragOver('Pending')"
            @dragleave="onDragLeave"
            @drop="onDrop('Pending')"
          >
            <div
              class="board-task"
              :class="task.priority.toLowerCase() + '-priority'"
              v-for="task in pendingTasks"
              :key="task.id"
              draggable="true"
              @dragstart="onDragStart(task.id)"
              @dragend="onDragEnd"
            >
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>

              <div class="board-task-meta">
                <span class="badge" :class="task.priority.toLowerCase()">{{ task.priority }}</span>
                <span class="status-pill">{{ task.date }}</span>
              </div>
            </div>

            <div v-if="!pendingTasks.length" class="empty-state" style="padding: 28px 14px;">
              <h3 style="font-size:18px;">No pending tasks</h3>
              <p>Drop a task here.</p>
            </div>
          </div>
        </div>

        <div class="board-column">
          <div class="board-column-header">
            <h3>In Progress</h3>
            <span class="column-count">{{ inProgressTasks.length }}</span>
          </div>

          <div
            class="drop-zone"
            :class="{ 'drag-over': dragOverColumn === 'In Progress' }"
            @dragover.prevent="onDragOver('In Progress')"
            @dragleave="onDragLeave"
            @drop="onDrop('In Progress')"
          >
            <div
              class="board-task"
              :class="task.priority.toLowerCase() + '-priority'"
              v-for="task in inProgressTasks"
              :key="task.id"
              draggable="true"
              @dragstart="onDragStart(task.id)"
              @dragend="onDragEnd"
            >
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>

              <div class="board-task-meta">
                <span class="badge" :class="task.priority.toLowerCase()">{{ task.priority }}</span>
                <span class="status-pill">{{ task.date }}</span>
              </div>
            </div>

            <div v-if="!inProgressTasks.length" class="empty-state" style="padding: 28px 14px;">
              <h3 style="font-size:18px;">No tasks in progress</h3>
              <p>Drop a task here.</p>
            </div>
          </div>
        </div>

        <div class="board-column">
          <div class="board-column-header">
            <h3>Completed</h3>
            <span class="column-count">{{ completedTasks.length }}</span>
          </div>

          <div
            class="drop-zone"
            :class="{ 'drag-over': dragOverColumn === 'Completed' }"
            @dragover.prevent="onDragOver('Completed')"
            @dragleave="onDragLeave"
            @drop="onDrop('Completed')"
          >
            <div
              class="board-task"
              :class="task.priority.toLowerCase() + '-priority'"
              v-for="task in completedTasks"
              :key="task.id"
              draggable="true"
              @dragstart="onDragStart(task.id)"
              @dragend="onDragEnd"
            >
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>

              <div class="board-task-meta">
                <span class="badge" :class="task.priority.toLowerCase()">{{ task.priority }}</span>
                <span class="status-pill">{{ task.date }}</span>
              </div>
            </div>

            <div v-if="!completedTasks.length" class="empty-state" style="padding: 28px 14px;">
              <h3 style="font-size:18px;">No completed tasks</h3>
              <p>Drop a task here.</p>
            </div>
          </div>
        </div>
      </div>

      <p class="drag-hint">Tip: drag a task card into another column to update its status.</p>
    </div>
  `,
  data() {
    return {
      draggedTaskId: null,
      dragOverColumn: null
    };
  },
  computed: {
    pendingTasks() {
      return taskStore.tasks.filter(task => task.status === "Pending");
    },
    inProgressTasks() {
      return taskStore.tasks.filter(task => task.status === "In Progress");
    },
    completedTasks() {
      return taskStore.tasks.filter(task => task.status === "Completed");
    }
  },
  methods: {
    onDragStart(taskId) {
      this.draggedTaskId = taskId;
    },
    onDragEnd() {
      this.draggedTaskId = null;
      this.dragOverColumn = null;
    },
    onDragOver(column) {
      this.dragOverColumn = column;
    },
    onDragLeave() {
      this.dragOverColumn = null;
    },
    onDrop(newStatus) {
      const task = taskStore.tasks.find(item => item.id === this.draggedTaskId);
      if (task) {
        task.status = newStatus;
        taskStore.saveTasks();
      }
      this.draggedTaskId = null;
      this.dragOverColumn = null;
    }
  }
};

const Settings = {
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1>Settings</h1>
          <p>Customize your dashboard preferences.</p>
        </div>
      </div>

      <div class="settings-box">
        <div class="setting-item">
          <div>
            <h3>Dark Mode</h3>
            <p class="task-desc">Switch between light and dark appearance.</p>
          </div>

          <button class="primary-btn" @click="toggleDarkMode">
            {{ $root.darkMode ? 'Disable' : 'Enable' }}
          </button>
        </div>

        <div class="setting-item">
          <div>
            <h3>Reset Demo Tasks</h3>
            <p class="task-desc">Restore the initial demo tasks for testing.</p>
          </div>

          <button class="secondary-btn" @click="resetDemoTasks">Reset</button>
        </div>

        <div class="setting-item">
          <div>
            <h3>Clear All Tasks</h3>
            <p class="task-desc">Delete all saved tasks from localStorage.</p>
          </div>

          <button class="danger-btn" @click="clearAllTasks">Clear</button>
        </div>
      </div>
    </div>
  `,
  methods: {
    toggleDarkMode() {
      this.$root.darkMode = !this.$root.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(this.$root.darkMode));
    },
    resetDemoTasks() {
      const confirmed = confirm("Reset all tasks to the default demo data?");
      if (!confirmed) return;
      taskStore.tasks = JSON.parse(JSON.stringify(defaultTasks));
      taskStore.saveTasks();
      this.$router.push("/");
    },
    clearAllTasks() {
      const confirmed = confirm("This will remove all tasks. Continue?");
      if (!confirmed) return;
      taskStore.tasks = [];
      taskStore.saveTasks();
      this.$router.push("/");
    }
  }
};

const routes = [
  { path: "/", component: Dashboard },
  { path: "/tasks", component: AllTasks },
  { path: "/board", component: Board },
  { path: "/add", component: AddTask },
  { path: "/task/:id", component: TaskDetails },
  { path: "/settings", component: Settings }
];

const router = new VueRouter({
  routes
});

new Vue({
  el: "#app",
  router,
  data: {
    darkMode: JSON.parse(localStorage.getItem("darkMode")) || false
  }
});