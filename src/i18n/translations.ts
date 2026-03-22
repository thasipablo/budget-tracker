export const translations = {
  en: {
    // Tabs
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    categories: 'Categories',
    charts: 'Charts',

    // Dashboard
    balance: 'Balance',
    income: 'Income',
    expenses: 'Expenses',
    recentTransactions: 'Recent Transactions',
    seeAll: 'See All',
    noTransactionsYet: 'No transactions yet',
    addFirst: 'Tap + to add your first transaction',

    // Transactions screen
    all: 'All',
    deleteTransaction: 'Delete Transaction',
    deleteTransactionMsg: 'Are you sure you want to delete this transaction?',
    noTransactions: 'No transactions',
    noTransactionsFilter: 'No transactions match this filter',

    // Categories screen
    expenseCategories: 'Expense Categories',
    incomeCategories: 'Income Categories',
    deleteCategory: 'Delete Category',
    deleteCategoryMsg: 'Delete "{{name}}"? Transactions using this category may be affected.',
    noCategories: 'No categories',
    edit: 'Edit',

    // Charts screen
    thisMonth: 'This Month',
    threeMonths: '3 Months',
    thisYear: 'This Year',
    expensesByCategory: 'Expenses by Category',
    incomeVsExpenses: 'Income vs Expenses',
    noExpenseData: 'No expense data for this period',
    noData: 'No data for this period',

    // Transaction form
    newTransaction: 'New Transaction',
    editTransaction: 'Edit Transaction',
    type: 'Type',
    expenseType: 'Expense',
    incomeType: 'Income',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    noteOptional: 'Note (optional)',
    addNote: 'Add a note…',
    saveTransaction: 'Save Transaction',
    saving: 'Saving…',
    invalidAmount: 'Invalid Amount',
    invalidAmountMsg: 'Please enter a valid amount.',
    selectCategory: 'Select Category',
    selectCategoryMsg: 'Please choose a category.',

    // Category form
    newCategory: 'New Category',
    editCategory: 'Edit Category',
    name: 'Name',
    namePlaceholder: 'e.g. Groceries',
    icon: 'Icon',
    color: 'Color',
    preview: 'Preview',
    categoryName: 'Category Name',
    saveCategory: 'Save Category',
    missingName: 'Missing Name',
    missingNameMsg: 'Please enter a category name.',
    deleteCategoryConfirm: 'This will delete the category. Existing transactions will be unlinked.',

    // Common
    cancel: 'Cancel',
    delete: 'Delete',
    startDate: 'Start Date',
    endDate: 'End Date',
    noCategory: 'Uncategorized',

    // Projects
    projects: 'Projects',
    newProject: 'New Project',
    editProject: 'Edit Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'e.g. Home Renovation',
    projectDescription: 'Description',
    projectDescriptionPlaceholder: 'What is this project about…',
    projectBudget: 'Budget (optional)',
    projectStatus: 'Status',
    active: 'Active',
    awaiting: 'Awaiting',
    done: 'Done',
    completed: 'Completed',
    archived: 'Archived',
    saveProject: 'Save Project',
    deleteProject: 'Delete Project',
    deleteProjectMsg: 'Delete "{{name}}"? All phases and expenses will be permanently removed.',
    missingProjectName: 'Missing Name',
    missingProjectNameMsg: 'Please enter a project name.',
    noProjects: 'No projects',
    addFirstProject: 'Tap + to create your first project',

    // Phases
    phases: 'Phases',
    newPhase: 'New Phase',
    editPhase: 'Edit Phase',
    phaseName: 'Phase Name',
    phaseNamePlaceholder: 'e.g. Planning',
    phaseBudget: 'Budget (optional)',
    savePhase: 'Save Phase',
    deletePhase: 'Delete Phase',
    deletePhaseMsg: 'Delete "{{name}}"? All expenses in this phase will be removed.',
    missingPhaseName: 'Missing Name',
    missingPhaseNameMsg: 'Please enter a phase name.',
    noPhases: 'No phases yet',
    addFirstPhase: 'Add a phase to get started',

    // Project Expenses
    noExpenses: 'No expenses yet',
    addFirstExpense: 'Add an expense to this phase',
    newExpense: 'New Expense',
    editExpense: 'Edit Expense',
    saveExpense: 'Save Expense',
    deleteExpense: 'Delete Expense',
    deleteExpenseMsg: 'Are you sure you want to delete this expense?',

    // Transfers
    fundProject: 'Fund Project',
    projectTransfers: 'Funding Transfers',
    newTransfer: 'Transfer Funds',
    saveTransfer: 'Transfer',
    transferDisclaimer: 'This will be recorded as an expense in your transactions.',
    deleteTransfer: 'Delete Transfer',
    deleteTransferMsg: 'Delete this transfer? The corresponding expense transaction will also be deleted.',
    noTransfers: 'No transfers yet',

    // Financial labels
    budget: 'Budget',
    spent: 'Spent',
    funded: 'Funded',
    totalBudget: 'Total Budget',
    totalFunded: 'Total Funded',
    totalSpent: 'Total Spent',
    overBudget: 'Over budget',
    noBudget: 'No budget set',

    // Project categories
    projectCategories: 'Project Categories',
    newProjectCategory: 'New Category',
  },

  fr: {
    // Tabs
    dashboard: 'Tableau de bord',
    transactions: 'Transactions',
    categories: 'Catégories',
    charts: 'Graphiques',

    // Dashboard
    balance: 'Solde',
    income: 'Revenus',
    expenses: 'Dépenses',
    recentTransactions: 'Transactions récentes',
    seeAll: 'Voir tout',
    noTransactionsYet: 'Aucune transaction',
    addFirst: 'Appuyez sur + pour ajouter votre première transaction',

    // Transactions screen
    all: 'Tout',
    deleteTransaction: 'Supprimer la transaction',
    deleteTransactionMsg: 'Voulez-vous vraiment supprimer cette transaction ?',
    noTransactions: 'Aucune transaction',
    noTransactionsFilter: 'Aucune transaction ne correspond à ce filtre',

    // Categories screen
    expenseCategories: 'Catégories de dépenses',
    incomeCategories: 'Catégories de revenus',
    deleteCategory: 'Supprimer la catégorie',
    deleteCategoryMsg: 'Supprimer « {{name}} » ? Les transactions associées pourraient être affectées.',
    noCategories: 'Aucune catégorie',
    edit: 'Modifier',

    // Charts screen
    thisMonth: 'Ce mois',
    threeMonths: '3 mois',
    thisYear: 'Cette année',
    expensesByCategory: 'Dépenses par catégorie',
    incomeVsExpenses: 'Revenus vs Dépenses',
    noExpenseData: 'Aucune donnée de dépense pour cette période',
    noData: 'Aucune donnée pour cette période',

    // Transaction form
    newTransaction: 'Nouvelle transaction',
    editTransaction: 'Modifier la transaction',
    type: 'Type',
    expenseType: 'Dépense',
    incomeType: 'Revenu',
    amount: 'Montant',
    category: 'Catégorie',
    date: 'Date',
    noteOptional: 'Note (facultatif)',
    addNote: 'Ajouter une note…',
    saveTransaction: 'Enregistrer',
    saving: 'Enregistrement…',
    invalidAmount: 'Montant invalide',
    invalidAmountMsg: 'Veuillez entrer un montant valide.',
    selectCategory: 'Choisir une catégorie',
    selectCategoryMsg: 'Veuillez sélectionner une catégorie.',

    // Category form
    newCategory: 'Nouvelle catégorie',
    editCategory: 'Modifier la catégorie',
    name: 'Nom',
    namePlaceholder: 'ex. Épicerie',
    icon: 'Icône',
    color: 'Couleur',
    preview: 'Aperçu',
    categoryName: 'Nom de catégorie',
    saveCategory: 'Enregistrer',
    missingName: 'Nom manquant',
    missingNameMsg: 'Veuillez entrer un nom de catégorie.',
    deleteCategoryConfirm: 'La catégorie sera supprimée. Les transactions associées seront dissociées.',

    // Common
    cancel: 'Annuler',
    delete: 'Supprimer',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    noCategory: 'Sans catégorie',

    // Projects
    projects: 'Projets',
    newProject: 'Nouveau projet',
    editProject: 'Modifier le projet',
    projectName: 'Nom du projet',
    projectNamePlaceholder: 'ex. Rénovation de la maison',
    projectDescription: 'Description',
    projectDescriptionPlaceholder: 'En quoi consiste ce projet…',
    projectBudget: 'Budget (facultatif)',
    projectStatus: 'Statut',
    active: 'Actif',
    awaiting: 'En attente',
    done: 'Terminée',
    completed: 'Terminé',
    archived: 'Archivé',
    saveProject: 'Enregistrer le projet',
    deleteProject: 'Supprimer le projet',
    deleteProjectMsg: 'Supprimer « {{name}} » ? Toutes les phases et dépenses seront définitivement supprimées.',
    missingProjectName: 'Nom manquant',
    missingProjectNameMsg: 'Veuillez entrer un nom de projet.',
    noProjects: 'Aucun projet',
    addFirstProject: 'Appuyez sur + pour créer votre premier projet',

    // Phases
    phases: 'Phases',
    newPhase: 'Nouvelle phase',
    editPhase: 'Modifier la phase',
    phaseName: 'Nom de la phase',
    phaseNamePlaceholder: 'ex. Planification',
    phaseBudget: 'Budget (facultatif)',
    savePhase: 'Enregistrer la phase',
    deletePhase: 'Supprimer la phase',
    deletePhaseMsg: 'Supprimer « {{name}} » ? Toutes les dépenses de cette phase seront supprimées.',
    missingPhaseName: 'Nom manquant',
    missingPhaseNameMsg: 'Veuillez entrer un nom de phase.',
    noPhases: 'Aucune phase',
    addFirstPhase: 'Ajoutez une phase pour commencer',

    // Project Expenses
    noExpenses: 'Aucune dépense',
    addFirstExpense: 'Ajoutez une dépense à cette phase',
    newExpense: 'Nouvelle dépense',
    editExpense: 'Modifier la dépense',
    saveExpense: 'Enregistrer la dépense',
    deleteExpense: 'Supprimer la dépense',
    deleteExpenseMsg: 'Voulez-vous vraiment supprimer cette dépense ?',

    // Transfers
    fundProject: 'Financer le projet',
    projectTransfers: 'Transferts de fonds',
    newTransfer: 'Transférer des fonds',
    saveTransfer: 'Transférer',
    transferDisclaimer: 'Cette somme sera enregistrée comme dépense dans vos transactions.',
    deleteTransfer: 'Supprimer le transfert',
    deleteTransferMsg: 'Supprimer ce transfert ? La transaction de dépense correspondante sera également supprimée.',
    noTransfers: 'Aucun transfert',

    // Financial labels
    budget: 'Budget',
    spent: 'Dépensé',
    funded: 'Financé',
    totalBudget: 'Budget total',
    totalFunded: 'Total financé',
    totalSpent: 'Total dépensé',
    overBudget: 'Dépassement',
    noBudget: 'Pas de budget défini',

    // Project categories
    projectCategories: 'Catégories du projet',
    newProjectCategory: 'Nouvelle catégorie',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
