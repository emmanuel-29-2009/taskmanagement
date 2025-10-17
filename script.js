
        // Sample initial data
        let tasks = [
            {
                id: 1,
                title: "Design homepage layout",
                description: "Create wireframes and mockups for the new homepage design",
                priority: "high",
                dueDate: "2023-06-15",
                status: "todo",
                project: "Website Redesign",
                labels: ["design", "frontend"]
            },
            {
                id: 2,
                title: "Write project proposal",
                description: "Draft a detailed proposal for the upcoming client project",
                priority: "medium",
                dueDate: "2023-06-20",
                status: "inProgress",
                project: "Client Project",
                labels: ["documentation", "planning"]
            },
            {
                id: 3,
                title: "Team meeting preparation",
                description: "Prepare agenda and materials for the weekly team meeting",
                priority: "low",
                dueDate: "2023-06-12",
                status: "completed",
                project: "Internal",
                labels: ["meeting"]
            },
            {
                id: 4,
                title: "Update documentation",
                description: "Review and update API documentation for recent changes",
                priority: "medium",
                dueDate: "2023-06-18",
                status: "todo",
                project: "Website Redesign",
                labels: ["documentation", "backend"]
            },
            {
                id: 5,
                title: "Fix login bug",
                description: "Investigate and fix the issue with user login on mobile devices",
                priority: "high",
                dueDate: "2023-06-14",
                status: "inProgress",
                project: "Mobile App",
                labels: ["bug", "mobile"]
            },
            {
                id: 6,
                title: "Research new technologies",
                description: "Explore potential new frameworks for the frontend development",
                priority: "low",
                dueDate: "2023-06-25",
                status: "todo",
                project: "R&D",
                labels: ["research"]
            },
            {
                id: 7,
                title: "Review team feedback",
                description: "Go through the feedback received from the team meeting",
                priority: "medium",
                dueDate: null,
                status: "todo",
                project: null,
                labels: ["feedback"]
            },
            {
                id: 8,
                title: "Prepare weekly report",
                description: "Compile data and create the weekly progress report",
                priority: "medium",
                dueDate: "2023-06-16",
                status: "inProgress",
                project: null,
                labels: ["reporting"]
            }
        ];

        let projects = [
            { id: 1, name: "Website Redesign", color: "#4361ee", taskCount: 2 },
            { id: 2, name: "Client Project", color: "#4cc9f0", taskCount: 1 },
            { id: 3, name: "Mobile App", color: "#f59e0b", taskCount: 1 },
            { id: 4, name: "Internal", color: "#4ade80", taskCount: 1 },
            { id: 5, name: "R&D", color: "#ef4444", taskCount: 1 }
        ];

        let labels = [
            { id: 1, name: "design", color: "#4361ee" },
            { id: 2, name: "frontend", color: "#4cc9f0" },
            { id: 3, name: "documentation", color: "#f59e0b" },
            { id: 4, name: "planning", color: "#4ade80" },
            { id: 5, name: "meeting", color: "#ef4444" },
            { id: 6, name: "backend", color: "#a855f7" },
            { id: 7, name: "bug", color: "#f59e0b" },
            { id: 8, name: "mobile", color: "#06b6d4" },
            { id: 9, name: "research", color: "#84cc16" },
            { id: 10, name: "feedback", color: "#f97316" },
            { id: 11, name: "reporting", color: "#8b5cf6" }
        ];

        // App settings
        let settings = {
            darkMode: false,
            compactView: false,
            reminders: true,
            alerts: true,
            autosync: true
        };

        // DOM Elements
        const taskModal = document.getElementById('taskModal');
        const taskForm = document.getElementById('taskForm');
        const newTaskBtn = document.getElementById('newTaskBtn');
        const closeModal = document.getElementById('closeModal');
        const cancelTask = document.getElementById('cancelTask');
        const syncBtn = document.getElementById('syncBtn');
        const exportBtn = document.getElementById('exportBtn');
        const taskLists = {
            todo: document.getElementById('todo-list'),
            inProgress: document.getElementById('inProgress-list'),
            completed: document.getElementById('completed-list')
        };

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadData();
            loadSettings();
            setupEventListeners();
            updateStats();
            applySettings();
            renderAllPages();
        });

        // Load data from localStorage or use sample data
        function loadData() {
            const savedTasks = localStorage.getItem('tasks');
            const savedProjects = localStorage.getItem('projects');
            const savedLabels = localStorage.getItem('labels');
            
            if (savedTasks) tasks = JSON.parse(savedTasks);
            if (savedProjects) projects = JSON.parse(savedProjects);
            if (savedLabels) labels = JSON.parse(savedLabels);
        }

        // Load settings from localStorage
        function loadSettings() {
            const savedSettings = localStorage.getItem('taskflowSettings');
            if (savedSettings) {
                settings = JSON.parse(savedSettings);
                
                // Update toggle switches to match settings
                document.getElementById('darkModeToggle').checked = settings.darkMode;
                document.getElementById('compactViewToggle').checked = settings.compactView;
                document.getElementById('remindersToggle').checked = settings.reminders;
                document.getElementById('alertsToggle').checked = settings.alerts;
                document.getElementById('autosyncToggle').checked = settings.autosync;
            }
        }

        // Save settings to localStorage
        function saveSettings() {
            localStorage.setItem('taskflowSettings', JSON.stringify(settings));
            applySettings();
        }

        // Apply current settings to the UI
        function applySettings() {
            // Apply dark mode
            if (settings.darkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            // Apply compact view
            if (settings.compactView) {
                document.querySelector('.container').classList.add('compact');
            } else {
                document.querySelector('.container').classList.remove('compact');
            }
        }

        // Save data to localStorage
        function saveData() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('projects', JSON.stringify(projects));
            localStorage.setItem('labels', JSON.stringify(labels));
            updateStats();
            updatePageCounts();
        }

        // Render all pages with current data
        function renderAllPages() {
            renderTasks();
            renderInboxTasks();
            renderTodayTasks();
            renderUpcomingTasks();
            renderProjects();
            renderLabels();
        }

        // Render tasks in their respective columns
        function renderTasks() {
            // Clear all task lists
            Object.values(taskLists).forEach(list => {
                list.innerHTML = '';
            });

            // Add tasks to their respective columns
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskLists[task.status].appendChild(taskElement);
            });

            // Update column counts
            updateColumnCounts();
            
            // Add empty state if no tasks in a column
            Object.keys(taskLists).forEach(status => {
                const list = taskLists[status];
                if (list.children.length === 0) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'empty-state';
                    emptyState.innerHTML = `
                        <i class="fas fa-clipboard-list"></i>
                        <p>No tasks here yet</p>
                    `;
                    list.appendChild(emptyState);
                }
            });
        }

        // Create a task element
        function createTaskElement(task) {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.draggable = true;
            taskElement.dataset.taskId = task.id;

            const priorityClass = `priority-${task.priority}`;
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let dateDisplay = 'No due date';
            if (dueDate) {
                if (dueDate < today && task.status !== 'completed') {
                    dateDisplay = `<span style="color: var(--danger);">Overdue: ${formatDate(dueDate)}</span>`;
                } else {
                    dateDisplay = formatDate(dueDate);
                }
            }

            // Get project and labels info
            const projectInfo = task.project ? `<div class="task-project" style="font-size: 0.8rem; color: var(--gray); margin-top: 5px;">
                <i class="fas fa-project-diagram"></i> ${task.project}
            </div>` : '';

            const labelsInfo = task.labels && task.labels.length > 0 ? 
                `<div class="task-labels" style="display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap;">
                    ${task.labels.map(label => {
                        const labelObj = labels.find(l => l.name === label);
                        return labelObj ? `<span style="background: ${labelObj.color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">${label}</span>` : '';
                    }).join('')}
                </div>` : '';

            taskElement.innerHTML = `
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <span class="task-priority ${priorityClass}">${task.priority.toUpperCase()}</span>
                    </div>
                    <div class="task-actions">
                        <button class="task-action edit-task" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action delete-task" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="task-description">${task.description || 'No description'}</div>
                ${projectInfo}
                ${labelsInfo}
                <div class="task-footer">
                    <div class="task-date">
                        <i class="far fa-calendar"></i>
                        ${dateDisplay}
                    </div>
                    <div class="task-id">#${task.id}</div>
                </div>
            `;

            // Add event listeners for task actions
            taskElement.querySelector('.edit-task').addEventListener('click', () => editTask(task.id));
            taskElement.querySelector('.delete-task').addEventListener('click', () => deleteTask(task.id));

            // Add drag events
            taskElement.addEventListener('dragstart', handleDragStart);
            taskElement.addEventListener('dragend', handleDragEnd);

            return taskElement;
        }

        // Format date for display
        function formatDate(date) {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
        }

        // Update task statistics
        function updateStats() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.status === 'completed').length;
            const pendingTasks = totalTasks - completedTasks;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const overdueTasks = tasks.filter(task => {
                if (task.status === 'completed') return false;
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate < today;
            }).length;

            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('completedTasks').textContent = completedTasks;
            document.getElementById('pendingTasks').textContent = pendingTasks;
            document.getElementById('overdueTasks').textContent = overdueTasks;
        }

        // Update column task counts
        function updateColumnCounts() {
            const todoCount = tasks.filter(task => task.status === 'todo').length;
            const inProgressCount = tasks.filter(task => task.status === 'inProgress').length;
            const completedCount = tasks.filter(task => task.status === 'completed').length;

            document.getElementById('todoCount').textContent = todoCount;
            document.getElementById('inProgressCount').textContent = inProgressCount;
            document.getElementById('completedCount').textContent = completedCount;
        }

        // Update page task counts
        function updatePageCounts() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const inboxCount = tasks.filter(task => !task.project).length;
            const todayCount = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate.toDateString() === today.toDateString();
            }).length;
            
            const upcomingCount = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return dueDate > today && dueDate <= nextWeek;
            }).length;

            document.getElementById('inboxCount').textContent = inboxCount;
            document.getElementById('todayCount').textContent = todayCount;
            document.getElementById('upcomingCount').textContent = upcomingCount;
        }

        // Render inbox tasks
        function renderInboxTasks() {
            const inboxTasks = tasks.filter(task => !task.project);
            const inboxList = document.getElementById('inbox-tasks');
            inboxList.innerHTML = '';
            
            if (inboxTasks.length === 0) {
                inboxList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>No tasks in inbox</p>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Tasks without a project appear here</p>
                    </div>
                `;
                return;
            }
            
            inboxTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                inboxList.appendChild(taskElement);
            });
        }

        // Render today's tasks
        function renderTodayTasks() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todayTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate.toDateString() === today.toDateString();
            });
            
            const todayList = document.getElementById('today-tasks');
            todayList.innerHTML = '';
            
            if (todayTasks.length === 0) {
                todayList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-alt"></i>
                        <p>No tasks for today</p>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Tasks due today will appear here</p>
                    </div>
                `;
                return;
            }
            
            todayTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                todayList.appendChild(taskElement);
            });
        }

        // Render upcoming tasks
        function renderUpcomingTasks() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            const upcomingTasks = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate > today && dueDate <= nextWeek;
            });
            
            const upcomingList = document.getElementById('upcoming-tasks');
            upcomingList.innerHTML = '';
            
            if (upcomingTasks.length === 0) {
                upcomingList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-week"></i>
                        <p>No upcoming tasks</p>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Tasks due in the next 7 days will appear here</p>
                    </div>
                `;
                return;
            }
            
            upcomingTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                upcomingList.appendChild(taskElement);
            });
        }

        // Render projects
        function renderProjects() {
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = '';
            
            if (projects.length === 0) {
                projectsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-project-diagram"></i>
                        <p>No projects yet</p>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Create a project to organize your tasks</p>
                    </div>
                `;
                return;
            }
            
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                
                // Count tasks for this project
                const taskCount = tasks.filter(task => task.project === project.name).length;
                
                projectElement.innerHTML = `
                    <div class="project-info">
                        <div class="project-color" style="background-color: ${project.color};"></div>
                        <div>
                            <div class="task-title">${project.name}</div>
                            <div class="task-description">${taskCount} task${taskCount !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action view-project" title="View Tasks">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="task-action edit-project" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action delete-project" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add event listeners
                projectElement.querySelector('.view-project').addEventListener('click', () => viewProjectTasks(project.name));
                projectElement.querySelector('.edit-project').addEventListener('click', () => editProject(project.id));
                projectElement.querySelector('.delete-project').addEventListener('click', () => deleteProject(project.id));
                
                projectsList.appendChild(projectElement);
            });
        }

        // Render labels
        function renderLabels() {
            const labelsList = document.getElementById('labels-list');
            labelsList.innerHTML = '';
            
            if (labels.length === 0) {
                labelsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tags"></i>
                        <p>No labels yet</p>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Create labels to categorize your tasks</p>
                    </div>
                `;
                return;
            }
            
            labels.forEach(label => {
                const labelElement = document.createElement('div');
                labelElement.className = 'label-item';
                
                // Count tasks with this label
                const taskCount = tasks.filter(task => task.labels && task.labels.includes(label.name)).length;
                
                labelElement.innerHTML = `
                    <div class="label-info">
                        <div class="label-color" style="background-color: ${label.color};"></div>
                        <div>
                            <div class="task-title">${label.name}</div>
                            <div class="task-description">${taskCount} task${taskCount !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action view-label" title="View Tasks">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="task-action edit-label" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action delete-label" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add event listeners
                labelElement.querySelector('.view-label').addEventListener('click', () => viewLabelTasks(label.name));
                labelElement.querySelector('.edit-label').addEventListener('click', () => editLabel(label.id));
                labelElement.querySelector('.delete-label').addEventListener('click', () => deleteLabel(label.id));
                
                labelsList.appendChild(labelElement);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Modal controls
            newTaskBtn.addEventListener('click', () => openModal());
            closeModal.addEventListener('click', () => closeModalWindow());
            cancelTask.addEventListener('click', () => closeModalWindow());
            
            // Form submission
            taskForm.addEventListener('submit', handleFormSubmit);
            
            // Add task buttons for each column
            document.querySelectorAll('.add-task-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const column = this.dataset.column;
                    openModal(column);
                });
            });
            
            // Page navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    const pageId = this.dataset.page + '-page';
                    switchPage(pageId);
                    
                    // Update active nav item
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Drag and drop for task lists
            Object.values(taskLists).forEach(list => {
                list.addEventListener('dragover', handleDragOver);
                list.addEventListener('dragenter', handleDragEnter);
                list.addEventListener('dragleave', handleDragLeave);
                list.addEventListener('drop', handleDrop);
            });
            
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    filterTasks(this.dataset.filter);
                });
            });
            
            // Sync button
            syncBtn.addEventListener('click', syncTasks);
            
            // Export button
            exportBtn.addEventListener('click', exportData);
            
            // Page-specific buttons
            document.getElementById('addInboxTask').addEventListener('click', () => openModal('todo'));
            document.getElementById('addTodayTask').addEventListener('click', () => {
                openModal('todo');
                // Set due date to today
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('taskDueDate').value = today;
            });
            document.getElementById('addUpcomingTask').addEventListener('click', () => openModal('todo'));
            document.getElementById('addProject').addEventListener('click', addProject);
            document.getElementById('addLabel').addEventListener('click', addLabel);
            
            // Settings toggles
            document.getElementById('darkModeToggle').addEventListener('change', function() {
                settings.darkMode = this.checked;
                saveSettings();
            });
            
            document.getElementById('compactViewToggle').addEventListener('change', function() {
                settings.compactView = this.checked;
                saveSettings();
            });
            
            document.getElementById('remindersToggle').addEventListener('change', function() {
                settings.reminders = this.checked;
                saveSettings();
                showNotification('Task reminders ' + (this.checked ? 'enabled' : 'disabled'));
            });
            
            document.getElementById('alertsToggle').addEventListener('change', function() {
                settings.alerts = this.checked;
                saveSettings();
                showNotification('Due date alerts ' + (this.checked ? 'enabled' : 'disabled'));
            });
            
            document.getElementById('autosyncToggle').addEventListener('change', function() {
                settings.autosync = this.checked;
                saveSettings();
                showNotification('Auto-sync ' + (this.checked ? 'enabled' : 'disabled'));
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === taskModal) {
                    closeModalWindow();
                }
            });
        }

        // Switch between pages
        function switchPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        // Open modal for adding/editing tasks
        function openModal(status = 'todo', taskId = null) {
            const modalTitle = document.getElementById('modalTitle');
            const taskIdInput = document.getElementById('taskId');
            const taskTitle = document.getElementById('taskTitle');
            const taskDescription = document.getElementById('taskDescription');
            const taskPriority = document.getElementById('taskPriority');
            const taskDueDate = document.getElementById('taskDueDate');
            const taskStatus = document.getElementById('taskStatus');
            
            if (taskId) {
                // Editing existing task
                modalTitle.textContent = 'Edit Task';
                const task = tasks.find(t => t.id === taskId);
                taskIdInput.value = task.id;
                taskTitle.value = task.title;
                taskDescription.value = task.description || '';
                taskPriority.value = task.priority;
                taskDueDate.value = task.dueDate || '';
                taskStatus.value = task.status;
            } else {
                // Adding new task
                modalTitle.textContent = 'Add New Task';
                taskIdInput.value = '';
                taskForm.reset();
                taskStatus.value = status;
            }
            
            taskModal.style.display = 'flex';
            taskTitle.focus();
        }

        // Close modal
        function closeModalWindow() {
            taskModal.style.display = 'none';
            taskForm.reset();
        }

        // Handle form submission
        function handleFormSubmit(e) {
            e.preventDefault();
            
            const taskId = document.getElementById('taskId').value;
            const title = document.getElementById('taskTitle').value.trim();
            const description = document.getElementById('taskDescription').value.trim();
            const priority = document.getElementById('taskPriority').value;
            const dueDate = document.getElementById('taskDueDate').value;
            const status = document.getElementById('taskStatus').value;
            
            if (!title) {
                alert('Please enter a task title');
                return;
            }
            
            if (taskId) {
                // Update existing task
                const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
                if (taskIndex !== -1) {
                    tasks[taskIndex] = {
                        ...tasks[taskIndex],
                        title,
                        description,
                        priority,
                        dueDate,
                        status
                    };
                }
            } else {
                // Add new task
                const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
                tasks.push({
                    id: newId,
                    title,
                    description,
                    priority,
                    dueDate: dueDate || null,
                    status,
                    project: null,
                    labels: []
                });
            }
            
            saveData();
            renderAllPages();
            closeModalWindow();
            
            // Show notification if alerts are enabled
            if (settings.alerts && dueDate) {
                const due = new Date(dueDate);
                const today = new Date();
                if (due < today) {
                    showNotification('Task added with overdue due date!', 'warning');
                }
            }
        }

        // Edit task
        function editTask(taskId) {
            openModal(null, taskId);
        }

        // Delete task
        function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(task => task.id !== taskId);
                saveData();
                renderAllPages();
                showNotification('Task deleted successfully');
            }
        }

        // Drag and Drop functionality
        let draggedTask = null;

        function handleDragStart(e) {
            draggedTask = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.dataset.taskId);
        }

        function handleDragEnd() {
            this.classList.remove('dragging');
            document.querySelectorAll('.task-list').forEach(list => {
                list.classList.remove('drop-zone');
            });
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        function handleDragEnter(e) {
            e.preventDefault();
            this.classList.add('drop-zone');
        }

        function handleDragLeave() {
            this.classList.remove('drop-zone');
        }

        function handleDrop(e) {
            e.preventDefault();
            this.classList.remove('drop-zone');
            
            const taskId = parseInt(e.dataTransfer.getData('text/plain'));
            const newStatus = this.dataset.status;
            
            // Update task status
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].status = newStatus;
                saveData();
                renderAllPages();
                
                // Show notification if alerts are enabled
                if (settings.alerts && newStatus === 'completed') {
                    showNotification('Task marked as completed!', 'success');
                }
            }
        }

        // Filter tasks
        function filterTasks(filter) {
            // This would filter tasks based on the selected filter
            console.log(`Filtering tasks by: ${filter}`);
            // In a real app, this would update the displayed tasks
            showNotification(`Filtering tasks by: ${filter}`);
        }

        // Sync tasks
        function syncTasks() {
            // In a real app, this would sync with a backend
            console.log('Syncing tasks...');
            showNotification('Tasks synchronized successfully!', 'success');
        }

        // Export data
        function exportData() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                tasks: tasks,
                projects: projects,
                labels: labels,
                exportedAt: new Date().toISOString()
            }, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "taskflow_data.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            showNotification('Data exported successfully!', 'success');
        }

        // Project functions
        function addProject() {
            const name = prompt('Enter project name:');
            if (name) {
                const colors = ['#4361ee', '#4cc9f0', '#f59e0b', '#4ade80', '#ef4444', '#a855f7'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                const newProject = {
                    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
                    name,
                    color,
                    taskCount: 0
                };
                
                projects.push(newProject);
                saveData();
                renderProjects();
                showNotification(`Project "${name}" created successfully!`, 'success');
            }
        }

        function editProject(projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                const newName = prompt('Enter new project name:', project.name);
                if (newName) {
                    project.name = newName;
                    saveData();
                    renderProjects();
                    showNotification('Project updated successfully!', 'success');
                }
            }
        }

        function deleteProject(projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                if (confirm(`Are you sure you want to delete the project "${project.name}"? This will remove the project from all tasks.`)) {
                    // Remove project from tasks
                    tasks.forEach(task => {
                        if (task.project === project.name) {
                            task.project = null;
                        }
                    });
                    
                    // Remove the project
                    projects = projects.filter(p => p.id !== projectId);
                    saveData();
                    renderAllPages();
                    showNotification('Project deleted successfully!', 'success');
                }
            }
        }

        function viewProjectTasks(projectName) {
            // Switch to dashboard and filter by project
            switchPage('dashboard-page');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-page="dashboard"]').classList.add('active');
            
            // In a real app, this would filter tasks by project
            showNotification(`Showing tasks for project: ${projectName}`);
        }

        // Label functions
        function addLabel() {
            const name = prompt('Enter label name:');
            if (name) {
                const colors = ['#4361ee', '#4cc9f0', '#f59e0b', '#4ade80', '#ef4444', '#a855f7', '#06b6d4', '#84cc16'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                const newLabel = {
                    id: labels.length > 0 ? Math.max(...labels.map(l => l.id)) + 1 : 1,
                    name,
                    color
                };
                
                labels.push(newLabel);
                saveData();
                renderLabels();
                showNotification(`Label "${name}" created successfully!`, 'success');
            }
        }

        function editLabel(labelId) {
            const label = labels.find(l => l.id === labelId);
            if (label) {
                const newName = prompt('Enter new label name:', label.name);
                if (newName) {
                    // Update label in tasks
                    tasks.forEach(task => {
                        if (task.labels && task.labels.includes(label.name)) {
                            task.labels = task.labels.map(l => l === label.name ? newName : l);
                        }
                    });
                    
                    label.name = newName;
                    saveData();
                    renderLabels();
                    renderAllPages();
                    showNotification('Label updated successfully!', 'success');
                }
            }
        }

        function deleteLabel(labelId) {
            const label = labels.find(l => l.id === labelId);
            if (label) {
                if (confirm(`Are you sure you want to delete the label "${label.name}"? This will remove the label from all tasks.`)) {
                    // Remove label from tasks
                    tasks.forEach(task => {
                        if (task.labels && task.labels.includes(label.name)) {
                            task.labels = task.labels.filter(l => l !== label.name);
                        }
                    });
                    
                    // Remove the label
                    labels = labels.filter(l => l.id !== labelId);
                    saveData();
                    renderAllPages();
                    showNotification('Label deleted successfully!', 'success');
                }
            }
        }

        function viewLabelTasks(labelName) {
            // Switch to dashboard and filter by label
            switchPage('dashboard-page');
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-page="dashboard"]').classList.add('active');
            
            // In a real app, this would filter tasks by label
            showNotification(`Showing tasks with label: ${labelName}`);
        }

        // Show notification
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            `;
            
            // Add styles for notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)'};
                color: white;
                padding: 12px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            
            // Add close button styles
            notification.querySelector('.notification-close').style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                margin: 0;
            `;
            
            // Add keyframes for animation
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Close notification when close button is clicked
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
            
            // Auto-remove notification after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
        }
   