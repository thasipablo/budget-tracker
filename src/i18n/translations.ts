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
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
