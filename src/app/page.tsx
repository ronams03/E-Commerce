'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Bell,
  Moon,
  Sun,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  UserPlus,
  Box,
  MoreHorizontal,
  Filter,
  Download,
  Eye,
  Check,
  Clock,
  XCircle,
  Truck,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  Star,
  Send,
  RefreshCw,
  Info,
  AlertTriangle,
  Globe,
  Building,
  FileText,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

// Types
type Page = 'dashboard' | 'products' | 'orders' | 'customers' | 'payments' | 'analytics' | 'discounts' | 'reviews' | 'settings'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  image: string
  sales: number
}

interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: 'completed' | 'pending' | 'processing' | 'shipped' | 'cancelled'
  date: string
  address: string
  phone: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  spent: number
  status: 'active' | 'inactive'
  joinDate: string
  avatar: string
}

interface Review {
  id: string
  customer: string
  product: string
  rating: number
  comment: string
  date: string
  status: 'published' | 'pending' | 'hidden'
}

interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  usage: number
  limit: number
  status: 'active' | 'expired' | 'disabled'
  expiry: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  time: string
  read: boolean
}

interface SystemSettings {
  systemName: string
  systemEmail: string
  systemPhone: string
  systemAddress: string
  currency: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  orderAlerts: boolean
  stockAlerts: boolean
}

// Sample data
const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 320 },
  { name: 'Apr', sales: 4500, orders: 280 },
  { name: 'May', sales: 6000, orders: 390 },
  { name: 'Jun', sales: 5500, orders: 350 },
  { name: 'Jul', sales: 7000, orders: 450 },
  { name: 'Aug', sales: 6500, orders: 420 },
  { name: 'Sep', sales: 8000, orders: 520 },
  { name: 'Oct', sales: 7500, orders: 480 },
  { name: 'Nov', sales: 9000, orders: 580 },
  { name: 'Dec', sales: 10000, orders: 650 },
]

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Sports', value: 12 },
  { name: 'Books', value: 8 },
]

const COLORS = ['rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(251, 191, 36, 0.8)']

const initialProducts: Product[] = [
  { id: 'PRD-001', name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, stock: 45, status: 'active', image: '💻', sales: 234 },
  { id: 'PRD-002', name: 'iPhone 15 Pro Max', category: 'Electronics', price: 1199, stock: 120, status: 'active', image: '📱', sales: 567 },
  { id: 'PRD-003', name: 'AirPods Pro 2', category: 'Electronics', price: 249, stock: 200, status: 'active', image: '🎧', sales: 890 },
  { id: 'PRD-004', name: 'iPad Air 5th Gen', category: 'Electronics', price: 799, stock: 78, status: 'active', image: '📲', sales: 345 },
  { id: 'PRD-005', name: 'Apple Watch Ultra', category: 'Electronics', price: 899, stock: 56, status: 'active', image: '⌚', sales: 123 },
  { id: 'PRD-006', name: 'Magic Keyboard', category: 'Accessories', price: 299, stock: 89, status: 'draft', image: '⌨️', sales: 67 },
  { id: 'PRD-007', name: 'Studio Display', category: 'Electronics', price: 1599, stock: 23, status: 'active', image: '🖥️', sales: 89 },
  { id: 'PRD-008', name: 'HomePod Mini', category: 'Home', price: 99, stock: 150, status: 'active', image: '🔊', sales: 456 },
]

const initialOrders: Order[] = [
  { id: 'ORD-2024-001', customer: 'John Doe', email: 'john@example.com', product: 'MacBook Pro 16"', amount: 2499, status: 'completed', date: '2024-01-15', address: '123 Main St, New York, NY 10001', phone: '+1 234-567-8900' },
  { id: 'ORD-2024-002', customer: 'Sarah Wilson', email: 'sarah@example.com', product: 'iPhone 15 Pro Max', amount: 1199, status: 'pending', date: '2024-01-15', address: '456 Oak Ave, Los Angeles, CA 90001', phone: '+1 234-567-8901' },
  { id: 'ORD-2024-003', customer: 'Mike Johnson', email: 'mike@example.com', product: 'AirPods Pro 2', amount: 249, status: 'processing', date: '2024-01-14', address: '789 Pine Rd, Chicago, IL 60601', phone: '+1 234-567-8902' },
  { id: 'ORD-2024-004', customer: 'Emily Brown', email: 'emily@example.com', product: 'iPad Air 5th Gen', amount: 799, status: 'shipped', date: '2024-01-14', address: '321 Elm St, Houston, TX 77001', phone: '+1 234-567-8903' },
  { id: 'ORD-2024-005', customer: 'David Lee', email: 'david@example.com', product: 'Apple Watch Ultra', amount: 899, status: 'cancelled', date: '2024-01-13', address: '654 Cedar Ln, Phoenix, AZ 85001', phone: '+1 234-567-8904' },
  { id: 'ORD-2024-006', customer: 'Lisa Chen', email: 'lisa@example.com', product: 'Magic Keyboard', amount: 299, status: 'completed', date: '2024-01-13', address: '987 Birch Dr, Philadelphia, PA 19101', phone: '+1 234-567-8905' },
]

const initialCustomers: Customer[] = [
  { id: 'CUS-001', name: 'John Doe', email: 'john@example.com', phone: '+1 234-567-8900', orders: 12, spent: 15234, status: 'active', joinDate: '2023-06-15', avatar: 'JD' },
  { id: 'CUS-002', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 234-567-8901', orders: 8, spent: 8976, status: 'active', joinDate: '2023-07-20', avatar: 'SW' },
  { id: 'CUS-003', name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234-567-8902', orders: 5, spent: 4521, status: 'active', joinDate: '2023-08-10', avatar: 'MJ' },
  { id: 'CUS-004', name: 'Emily Brown', email: 'emily@example.com', phone: '+1 234-567-8903', orders: 15, spent: 22340, status: 'active', joinDate: '2023-05-05', avatar: 'EB' },
  { id: 'CUS-005', name: 'David Lee', email: 'david@example.com', phone: '+1 234-567-8904', orders: 3, spent: 1899, status: 'inactive', joinDate: '2023-09-01', avatar: 'DL' },
]

const initialReviews: Review[] = [
  { id: 'REV-001', customer: 'John Doe', product: 'MacBook Pro 16"', rating: 5, comment: 'Absolutely amazing laptop!', date: '2024-01-15', status: 'published' },
  { id: 'REV-002', customer: 'Sarah Wilson', product: 'iPhone 15 Pro Max', rating: 4, comment: 'Great phone, battery could be better.', date: '2024-01-14', status: 'published' },
  { id: 'REV-003', customer: 'Mike Johnson', product: 'AirPods Pro 2', rating: 5, comment: 'Best earbuds I have ever owned!', date: '2024-01-13', status: 'pending' },
  { id: 'REV-004', customer: 'Emily Brown', product: 'iPad Air 5th Gen', rating: 4, comment: 'Perfect for work and entertainment.', date: '2024-01-12', status: 'published' },
]

const initialDiscounts: Discount[] = [
  { id: 'DIS-001', code: 'SAVE20', type: 'percentage', value: 20, usage: 234, limit: 500, status: 'active', expiry: '2024-12-31' },
  { id: 'DIS-002', code: 'FLAT50', type: 'fixed', value: 50, usage: 89, limit: 200, status: 'active', expiry: '2024-06-30' },
  { id: 'DIS-003', code: 'NEWYEAR', type: 'percentage', value: 15, usage: 456, limit: 500, status: 'expired', expiry: '2024-01-01' },
]

const initialNotifications: Notification[] = [
  { id: 'NOT-001', title: 'New Order', message: 'Order #ORD-2024-008 has been placed by Anna Kim', type: 'info', time: '2 min ago', read: false },
  { id: 'NOT-002', title: 'Payment Received', message: 'Payment of $2,499 received for order #ORD-2024-001', type: 'success', time: '15 min ago', read: false },
  { id: 'NOT-003', title: 'Low Stock Alert', message: 'Studio Display has only 23 units left in stock', type: 'warning', time: '1 hour ago', read: false },
  { id: 'NOT-004', title: 'Order Cancelled', message: 'Order #ORD-2024-005 was cancelled by customer', type: 'error', time: '2 hours ago', read: true },
  { id: 'NOT-005', title: 'New Customer', message: 'Lisa Chen registered a new account', type: 'info', time: '3 hours ago', read: true },
  { id: 'NOT-006', title: 'Review Posted', message: 'John Doe left a 5-star review on MacBook Pro 16"', type: 'success', time: '5 hours ago', read: true },
]

const initialSettings: SystemSettings = {
  systemName: 'GlassAdmin',
  systemEmail: 'admin@glassadmin.com',
  systemPhone: '+1 (555) 123-4567',
  systemAddress: '123 Commerce Street, Tech City, TC 12345',
  currency: 'USD',
  timezone: 'America/New_York',
  emailNotifications: true,
  pushNotifications: true,
  orderAlerts: true,
  stockAlerts: true,
}

// Navigation items
const navItems = [
  { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'products' as Page, icon: Package, label: 'Products', submenu: [
    { id: 'all-products', label: 'All Products' },
    { id: 'add-new', label: 'Add New' },
    { id: 'categories', label: 'Categories' },
    { id: 'inventory', label: 'Inventory' }
  ]},
  { id: 'orders' as Page, icon: ShoppingCart, label: 'Orders', badge: 12, submenu: [
    { id: 'all-orders', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'returns', label: 'Returns' }
  ]},
  { id: 'customers' as Page, icon: Users, label: 'Customers' },
  { id: 'payments' as Page, icon: CreditCard, label: 'Payments' },
  { id: 'analytics' as Page, icon: BarChart3, label: 'Analytics' },
  { id: 'discounts' as Page, icon: Tag, label: 'Discounts & Coupons' },
  { id: 'reviews' as Page, icon: MessageSquare, label: 'Reviews' },
  { id: 'settings' as Page, icon: Settings, label: 'Settings' },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string; icon: typeof Check }> = {
    completed: { label: 'Completed', className: 'badge-success', icon: Check },
    pending: { label: 'Pending', className: 'badge-warning', icon: Clock },
    processing: { label: 'Processing', className: 'badge-info', icon: RefreshCw },
    shipped: { label: 'Shipped', className: 'badge-info', icon: Truck },
    cancelled: { label: 'Cancelled', className: 'badge-error', icon: XCircle },
    active: { label: 'Active', className: 'badge-success', icon: Check },
    draft: { label: 'Draft', className: 'badge-warning', icon: Clock },
    archived: { label: 'Archived', className: 'badge-error', icon: XCircle },
    inactive: { label: 'Inactive', className: 'badge-error', icon: XCircle },
    published: { label: 'Published', className: 'badge-success', icon: Check },
    hidden: { label: 'Hidden', className: 'badge-error', icon: XCircle },
    expired: { label: 'Expired', className: 'badge-error', icon: XCircle },
    disabled: { label: 'Disabled', className: 'badge-warning', icon: XCircle },
  }
  const { label, className, icon: Icon } = config[status] || { label: status, className: 'badge-info', icon: AlertCircle }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

// Notification icon
const NotificationIcon = ({ type }: { type: string }) => {
  const icons: Record<string, { icon: typeof Info; color: string }> = {
    info: { icon: Info, color: 'text-blue-400' },
    success: { icon: Check, color: 'text-green-400' },
    warning: { icon: AlertTriangle, color: 'text-yellow-400' },
    error: { icon: XCircle, color: 'text-red-400' },
  }
  const { icon: Icon, color } = icons[type] || { icon: Info, color: 'text-blue-400' }
  return <Icon className={`w-5 h-5 ${color}`} />
}

// Custom tooltip for chart
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 min-w-[120px]">
        <p className="text-xs font-medium mb-2 opacity-70">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name === 'sales' ? `$${entry.value.toLocaleString()}` : entry.value} {entry.name === 'orders' ? 'orders' : ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Custom hook for hydration-safe mounted state
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', type: 'success' as const })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const mounted = useMounted()
  const { theme, setTheme } = useTheme()

  // Data states
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [settings, setSettings] = useState<SystemSettings>(initialSettings)

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  // Selected items
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Form states
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Electronics', price: 0, stock: 0, status: 'active' as const })
  const [newDiscount, setNewDiscount] = useState({ code: '', type: 'percentage' as const, value: 0, limit: 100, expiry: '' })

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Calculate unread notifications
  const unreadCount = notifications.filter(n => !n.read).length

  // Toast notification
  const showToastNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ title, message, type })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenu(expandedSubmenu === id ? null : id)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    showToastNotification('Theme Changed', `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`, 'success')
  }

  // Handle submenu item click
  const handleSubmenuClick = (page: Page, subPageId: string) => {
    setActivePage(page)
    setActiveSubPage(subPageId)
    
    if (page === 'products' && subPageId === 'add-new') {
      setSelectedProduct(null)
      setNewProduct({ name: '', category: 'Electronics', price: 0, stock: 0, status: 'active' })
      setShowProductModal(true)
    }
    
    if (page === 'orders') {
      if (subPageId === 'pending') setFilterStatus('pending')
      else if (subPageId === 'completed') setFilterStatus('completed')
      else if (subPageId === 'returns') setFilterStatus('cancelled')
      else setFilterStatus('all')
    }
    
    setMobileMenuOpen(false)
  }

  // Handle logout
  const handleLogout = () => setShowLogoutModal(true)

  const confirmLogout = () => {
    setShowLogoutModal(false)
    setIsLoggedIn(false)
    setLoginForm({ email: '', password: '' })
    setLoginError('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo login - accept any email/password
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true)
      setActivePage('dashboard')
      showToastNotification('Welcome Back!', 'You have been successfully logged in', 'success')
    } else {
      setLoginError('Please enter email and password')
    }
  }

  // Handlers
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus })
    showToastNotification('Order Updated', `Order status changed to ${newStatus}`, 'success')
  }

  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.price <= 0) {
      showToastNotification('Error', 'Please fill in all required fields', 'error')
      return
    }
    const product: Product = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      ...newProduct,
      image: '📦',
      sales: 0,
    }
    setProducts([...products, product])
    setShowProductModal(false)
    setNewProduct({ name: '', category: 'Electronics', price: 0, stock: 0, status: 'active' })
    showToastNotification('Product Added', `${product.name} has been added successfully`, 'success')
  }

  const handleDeleteProduct = (productId: string) => {
    setConfirmAction(() => () => {
      setProducts(products.filter(p => p.id !== productId))
      setShowConfirmModal(false)
      showToastNotification('Product Deleted', 'Product has been removed', 'success')
    })
    setConfirmMessage('Are you sure you want to delete this product?')
    setShowConfirmModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setNewProduct({ name: product.name, category: product.category, price: product.price, stock: product.stock, status: product.status })
    setShowProductModal(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleAddDiscount = () => {
    if (!newDiscount.code) {
      showToastNotification('Error', 'Please enter a discount code', 'error')
      return
    }
    const discount: Discount = {
      id: `DIS-${String(discounts.length + 1).padStart(3, '0')}`,
      ...newDiscount,
      usage: 0,
      status: 'active',
    }
    setDiscounts([...discounts, discount])
    setShowDiscountModal(false)
    setNewDiscount({ code: '', type: 'percentage', value: 0, limit: 100, expiry: '' })
    showToastNotification('Discount Created', `Discount code ${discount.code} has been created`, 'success')
  }

  const handleToggleDiscount = (discountId: string) => {
    setDiscounts(discounts.map(d => d.id === discountId ? { ...d, status: d.status === 'active' ? 'disabled' : 'active' } : d))
    showToastNotification('Discount Updated', 'Discount status has been changed', 'success')
  }

  const handleUpdateReviewStatus = (reviewId: string, newStatus: Review['status']) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: newStatus } : r))
    showToastNotification('Review Updated', `Review has been ${newStatus}`, 'success')
  }

  const handleSaveSettings = () => {
    showToastNotification('Settings Saved', 'Your settings have been updated successfully', 'success')
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    showToastNotification('Notifications', 'All notifications marked as read', 'success')
  }

  const handleClearNotifications = () => {
    setNotifications([])
    setShowNotifications(false)
    showToastNotification('Notifications', 'All notifications cleared', 'info')
  }

  const handleExport = (type: string) => {
    showToastNotification('Export Started', `Exporting ${type} data...`, 'info')
  }

  // Filter functions
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [products, searchQuery, filterStatus])

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || o.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, filterStatus])

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [customers, searchQuery, filterStatus])

  // Stats data
  const statsData = [
    { id: 'revenue', title: 'Total Revenue', value: '$124,563.00', change: '+12.5%', trend: 'up', icon: DollarSign, iconBg: 'icon-bg-green' },
    { id: 'orders', title: 'Total Orders', value: '3,842', change: '+8.2%', trend: 'up', icon: ShoppingBag, iconBg: 'icon-bg-purple' },
    { id: 'customers', title: 'New Customers', value: '1,257', change: '+15.3%', trend: 'up', icon: UserPlus, iconBg: 'icon-bg-pink' },
    { id: 'products', title: 'Products Sold', value: '8,492', change: '-2.4%', trend: 'down', icon: Box, iconBg: 'icon-bg-blue' },
  ]

  // Render functions
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-sm opacity-60 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('dashboard')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => showToastNotification('Refreshed', 'Dashboard data has been refreshed', 'info')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 group cursor-pointer"
              onClick={() => {
                if (stat.id === 'orders') setActivePage('orders')
                else if (stat.id === 'customers') setActivePage('customers')
                else if (stat.id === 'products') setActivePage('products')
                else if (stat.id === 'revenue') setActivePage('analytics')
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-xs opacity-60 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Sales Overview</h2>
            <p className="text-sm opacity-60">Monthly sales performance</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(168, 85, 247, 0.4)" />
                  <stop offset="95%" stopColor="rgba(168, 85, 247, 0)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="rgba(168, 85, 247, 0.8)" strokeWidth={2} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <p className="text-sm opacity-60">Latest customer orders</p>
          </div>
          <button onClick={() => setActivePage('orders')} className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-sm font-medium self-start">
            <Eye className="w-4 h-4" />
            View All
          </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order, index) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + index * 0.05 }} className="table-row-glass border-b border-white/5">
                  <td className="py-3 px-4"><span className="font-mono text-xs font-medium">{order.id}</span></td>
                  <td className="py-3 px-4"><span className="text-xs">{order.customer}</span></td>
                  <td className="py-3 px-4"><span className="font-semibold text-xs">${order.amount.toLocaleString()}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg glass-button hover:glow-purple">
                      <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Products</h1>
          <p className="text-sm opacity-60 mt-1">Manage your product inventory</p>
        </div>
        <button onClick={() => { setSelectedProduct(null); setNewProduct({ name: '', category: 'Electronics', price: 0, stock: 0, status: 'active' }); setShowProductModal(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium bg-purple-500/20 hover:bg-purple-500/30">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl glass-input text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <button onClick={() => handleExport('products')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{product.image}</div>
              <StatusBadge status={product.status} />
            </div>
            <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
            <p className="text-xs opacity-60 mb-2">{product.category}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">${product.price.toLocaleString()}</span>
              <span className="opacity-60">{product.stock} in stock</span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <span className="text-xs opacity-50">{product.sales} sold</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditProduct(product)} className="p-1.5 rounded-lg glass-button hover:glow-purple"><Edit className="w-3 h-3" /></button>
                <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 rounded-lg glass-button hover:bg-red-500/20"><Trash2 className="w-3 h-3 text-red-400" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Orders</h1>
          <p className="text-sm opacity-60 mt-1">Manage customer orders</p>
        </div>
        <button onClick={() => handleExport('orders')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl glass-input text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="glass-card p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Order ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row-glass border-b border-white/5">
                  <td className="py-3 px-4"><span className="font-mono text-xs font-medium">{order.id}</span></td>
                  <td className="py-3 px-4"><span className="text-xs">{order.customer}</span></td>
                  <td className="py-3 px-4"><span className="font-semibold text-xs">${order.amount.toLocaleString()}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                  <td className="py-3 px-4"><span className="text-xs opacity-70">{order.date}</span></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleViewOrder(order)} className="p-1.5 rounded-lg glass-button hover:glow-purple">
                      <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Customers</h1>
          <p className="text-sm opacity-60 mt-1">Manage your customer base</p>
        </div>
        <button onClick={() => handleExport('customers')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
          <Download className="w-4 h-4" />
          Export Customers
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input type="text" placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl glass-input text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="glass-card p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Orders</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Total Spent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <motion.tr key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row-glass border-b border-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                        <span className="font-semibold text-xs">{customer.avatar}</span>
                      </div>
                      <span className="text-xs font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="text-xs">{customer.email}</span></td>
                  <td className="py-3 px-4"><span className="text-xs font-medium">{customer.orders}</span></td>
                  <td className="py-3 px-4"><span className="font-semibold text-xs">${customer.spent.toLocaleString()}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={customer.status} /></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleViewCustomer(customer)} className="p-1.5 rounded-lg glass-button hover:glow-purple">
                      <Eye className="w-3 h-3" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Payments</h1>
          <p className="text-sm opacity-60 mt-1">Transaction history and payouts</p>
        </div>
        <button onClick={() => handleExport('payments')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
          <Download className="w-4 h-4" />
          Export Transactions
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <p className="text-xs opacity-60 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-400">$124,563</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs opacity-60 mb-1">Pending Payouts</p>
          <p className="text-2xl font-bold text-yellow-400">$8,420</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-xs opacity-60 mb-1">This Month</p>
          <p className="text-2xl font-bold text-purple-400">$32,150</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                  {order.status === 'completed' ? <Check className="w-5 h-5 text-green-400" /> : <Clock className="w-5 h-5 text-yellow-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{order.customer}</p>
                  <p className="text-xs opacity-50">{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">${order.amount.toLocaleString()}</p>
                <p className="text-xs opacity-50">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
          <p className="text-sm opacity-60 mt-1">Detailed business insights</p>
        </div>
        <button onClick={() => handleExport('analytics')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Month</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="rgba(168, 85, 247, 0.6)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDiscounts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Discounts & Coupons</h1>
          <p className="text-sm opacity-60 mt-1">Manage promotional codes</p>
        </div>
        <button onClick={() => setShowDiscountModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm font-medium bg-purple-500/20 hover:bg-purple-500/30">
          <Plus className="w-4 h-4" />
          Create Discount
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Code</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Value</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Usage</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider opacity-60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount, index) => (
                <motion.tr key={discount.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="table-row-glass border-b border-white/5">
                  <td className="py-3 px-4"><span className="font-mono text-xs font-semibold">{discount.code}</span></td>
                  <td className="py-3 px-4"><span className="text-xs capitalize">{discount.type}</span></td>
                  <td className="py-3 px-4"><span className="font-medium text-xs">{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</span></td>
                  <td className="py-3 px-4"><span className="text-xs">{discount.usage} / {discount.limit}</span></td>
                  <td className="py-3 px-4"><StatusBadge status={discount.status} /></td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleToggleDiscount(discount.id)} className={`p-1.5 rounded-lg glass-button ${discount.status === 'active' ? 'hover:bg-red-500/20' : 'hover:bg-green-500/20'}`}>
                      {discount.status === 'active' ? <XCircle className="w-3 h-3 text-red-400" /> : <Check className="w-3 h-3 text-green-400" />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Reviews</h1>
          <p className="text-sm opacity-60 mt-1">Customer feedback management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{review.customer}</h3>
                <p className="text-xs opacity-60">{review.product}</p>
              </div>
              <StatusBadge status={review.status} />
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'opacity-30'}`} />
              ))}
            </div>
            <p className="text-xs opacity-80 mb-3">{review.comment}</p>
            <div className="flex items-center justify-between text-xs opacity-50">
              <span>{review.date}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateReviewStatus(review.id, 'published')} className="p-1 rounded glass-button hover:bg-green-500/20"><Check className="w-3 h-3 text-green-400" /></button>
                <button onClick={() => handleUpdateReviewStatus(review.id, 'hidden')} className="p-1 rounded glass-button hover:bg-red-500/20"><XCircle className="w-3 h-3 text-red-400" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-sm opacity-60 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Building className="w-5 h-5" />
            System Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs opacity-60 mb-2 block">System Name</label>
              <input type="text" value={settings.systemName} onChange={(e) => setSettings({ ...settings, systemName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
            </div>
            <div>
              <label className="text-xs opacity-60 mb-2 block">System Email</label>
              <input type="email" value={settings.systemEmail} onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
            </div>
            <div>
              <label className="text-xs opacity-60 mb-2 block">Phone Number</label>
              <input type="tel" value={settings.systemPhone} onChange={(e) => setSettings({ ...settings, systemPhone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
            </div>
            <div>
              <label className="text-xs opacity-60 mb-2 block">Address</label>
              <input type="text" value={settings.systemAddress} onChange={(e) => setSettings({ ...settings, systemAddress: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs opacity-60 mb-2 block">Currency</label>
                <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="text-xs opacity-60 mb-2 block">Timezone</label>
                <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm">
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance & Notifications */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs opacity-60">Toggle dark theme</p>
              </div>
              <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-purple-500' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs opacity-60">Receive email updates</p>
              </div>
              <button onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })} className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-purple-500' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.emailNotifications ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-sm">Push Notifications</p>
                <p className="text-xs opacity-60">Browser notifications</p>
              </div>
              <button onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })} className={`relative w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-purple-500' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.pushNotifications ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-sm">Order Alerts</p>
                <p className="text-xs opacity-60">New order notifications</p>
              </div>
              <button onClick={() => setSettings({ ...settings, orderAlerts: !settings.orderAlerts })} className={`relative w-12 h-6 rounded-full transition-colors ${settings.orderAlerts ? 'bg-purple-500' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.orderAlerts ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-sm">Stock Alerts</p>
                <p className="text-xs opacity-60">Low stock warnings</p>
              </div>
              <button onClick={() => setSettings({ ...settings, stockAlerts: !settings.stockAlerts })} className={`relative w-12 h-6 rounded-full transition-colors ${settings.stockAlerts ? 'bg-purple-500' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.stockAlerts ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass-button bg-purple-500/20 hover:bg-purple-500/30 font-medium text-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Data Management
        </h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => handleExport('all')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm">
            <Download className="w-4 h-4" />
            Export All Data
          </button>
          <button onClick={() => showToastNotification('Backup Created', 'Your data backup has been created', 'success')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button text-sm">
            <Save className="w-4 h-4" />
            Create Backup
          </button>
        </div>
      </div>
    </div>
  )

  // Render current page
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard': return renderDashboard()
      case 'products': return renderProducts()
      case 'orders': return renderOrders()
      case 'customers': return renderCustomers()
      case 'payments': return renderPayments()
      case 'analytics': return renderAnalytics()
      case 'discounts': return renderDiscounts()
      case 'reviews': return renderReviews()
      case 'settings': return renderSettings()
      default: return renderDashboard()
    }
  }

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-mesh relative overflow-hidden dark flex items-center justify-center p-4">
        {/* Floating background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4 glow-purple">
              <span className="text-3xl font-bold text-gradient">{settings.systemName.charAt(0)}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{settings.systemName}</h1>
            <p className="text-sm opacity-60">Sign in to your admin account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs opacity-60 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs opacity-60 mb-2 block">Password</label>
              <div className="relative">
                <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {loginError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-400 flex items-center gap-2"
              >
                <AlertCircle className="w-3 h-3" />
                {loginError}
              </motion.p>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="opacity-60">Remember me</span>
              </label>
              <button type="button" className="text-purple-400 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 font-medium text-sm transition-colors"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              Sign In
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs opacity-60 text-center">
              <strong>Demo:</strong> Enter any email and password to login
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs opacity-40 mt-8">
            &copy; 2024 {settings.systemName}. All rights reserved.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden dark">
      {/* Floating background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarExpanded ? 260 : 80, x: mobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0) }}
        className={`fixed left-0 top-0 h-screen glass-sidebar z-50 sidebar-transition overflow-hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ borderRadius: '0 24px 24px 0' }}
      >
        <div className="h-[70px] flex items-center justify-between px-4 border-b border-white/10">
          <motion.div initial={false} animate={{ opacity: sidebarExpanded ? 1 : 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center glow-purple">
              <span className="text-lg font-bold text-gradient">{settings.systemName.charAt(0)}</span>
            </div>
            <span className="font-semibold text-sm">{settings.systemName}</span>
          </motion.div>
          <motion.button initial={false} animate={{ opacity: sidebarExpanded ? 1 : 0 }} onClick={() => setSidebarExpanded(!sidebarExpanded)} className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg glass-button hover:glow-purple">
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg glass-button">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!sidebarExpanded && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSidebarExpanded(true)} className="hidden lg:flex w-10 h-10 mx-auto mt-4 items-center justify-center rounded-xl glass-button hover:glow-purple">
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}

        <nav className="p-4 space-y-2 overflow-y-auto custom-scrollbar h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id && !activeSubPage
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isSubmenuExpanded = expandedSubmenu === item.id

            return (
              <div key={item.id}>
                <motion.button
                  onClick={() => { setActivePage(item.id); setActiveSubPage(null); if (hasSubmenu) toggleSubmenu(item.id); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? 'glass-nav-item active' : 'glass-nav-item hover:bg-white/10'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                  <motion.span initial={false} animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }} className="font-medium text-sm whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                  {item.badge && sidebarExpanded && <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/30 text-purple-300">{item.badge}</span>}
                  {hasSubmenu && sidebarExpanded && <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${isSubmenuExpanded ? 'rotate-180' : ''}`} />}
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-3 py-2 rounded-lg glass-card text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {hasSubmenu && isSubmenuExpanded && sidebarExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-4 pl-4 border-l border-white/10">
                      {item.submenu!.map((subitem) => {
                        const isSubActive = activePage === item.id && activeSubPage === subitem.id
                        return (
                          <button key={subitem.id} onClick={() => handleSubmenuClick(item.id, subitem.id)} className={`w-full text-left px-4 py-2 text-xs rounded-lg transition-colors ${isSubActive ? 'bg-white/15 text-purple-400 font-medium' : 'glass-nav-item hover:bg-white/10'}`}>
                            {subitem.label}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl glass-nav-item hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5 text-red-400" />
            <motion.span initial={false} animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }} className="font-medium text-sm text-red-400 whitespace-nowrap overflow-hidden">
              Logout
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="transition-all duration-300" style={{ marginLeft: sidebarExpanded ? 260 : 80 }}>
        {/* Header */}
        <header className="sticky top-0 z-30 px-4 lg:px-6 py-3">
          <div className="glass-card rounded-2xl px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg glass-button">
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl glass-button hover:glow-purple">
                {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-xl glass-button hover:glow-pink">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl overflow-hidden z-50">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={handleMarkAllRead} className="text-xs text-purple-400 hover:underline">Mark all read</button>
                          <button onClick={handleClearNotifications} className="text-xs text-red-400 hover:underline">Clear</button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-sm opacity-60">No notifications</div>
                        ) : (
                          notifications.map((notification) => (
                            <div key={notification.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-white/5' : ''}`}>
                              <div className="flex items-start gap-3">
                                <NotificationIcon type={notification.type} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">{notification.title}</p>
                                  <p className="text-xs opacity-60 mt-0.5 truncate">{notification.message}</p>
                                  <p className="text-xs opacity-40 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center cursor-pointer hover:glow-purple transition-shadow">
                  <span className="font-semibold text-sm">JD</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs opacity-60">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="opacity-60">Home</span>
            <ChevronRight className="w-4 h-4 opacity-40" />
            <span className="font-medium capitalize">{activePage}</span>
          </div>

          {renderCurrentPage()}

          {/* Footer */}
          <footer className="py-6 text-center text-xs opacity-50 mt-8">
            <p>&copy; 2024 {settings.systemName}. All rights reserved.</p>
            <p className="mt-1">Built with Next.js & Tailwind CSS</p>
          </footer>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="fixed bottom-6 left-1/2 z-50 glass-card px-6 py-4 rounded-2xl flex items-center gap-3">
            {toastMessage.type === 'success' && <Check className="w-5 h-5 text-green-400" />}
            {toastMessage.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
            {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            <div>
              <p className="font-semibold text-sm">{toastMessage.title}</p>
              <p className="text-xs opacity-70">{toastMessage.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowOrderModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Order Details</h2>
                <button onClick={() => setShowOrderModal(false)} className="p-2 rounded-lg glass-button"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="opacity-60">Order ID</span><span className="font-mono font-semibold">{selectedOrder.id}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Customer</span><span className="font-medium">{selectedOrder.customer}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Email</span><span>{selectedOrder.email}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Phone</span><span>{selectedOrder.phone}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Product</span><span>{selectedOrder.product}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Amount</span><span className="font-bold">${selectedOrder.amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Date</span><span>{selectedOrder.date}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Status</span><StatusBadge status={selectedOrder.status} /></div>
                <div className="pt-4 border-t border-white/10">
                  <p className="opacity-60 mb-2">Shipping Address</p>
                  <p className="text-xs">{selectedOrder.address}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="opacity-60 mb-3">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'processing', 'shipped', 'completed', 'cancelled'] as const).map((status) => (
                      <button key={status} onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)} className={`px-3 py-1.5 rounded-lg text-xs font-medium glass-button ${selectedOrder.status === status ? 'ring-2 ring-purple-400' : ''}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowProductModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowProductModal(false)} className="p-2 rounded-lg glass-button"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Product Name</label>
                  <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Enter product name" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm">
                    <option>Electronics</option>
                    <option>Accessories</option>
                    <option>Home</option>
                    <option>Clothing</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs opacity-60 mb-2 block">Price</label>
                    <input type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} placeholder="0" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                  </div>
                  <div>
                    <label className="text-xs opacity-60 mb-2 block">Stock</label>
                    <input type="number" value={newProduct.stock || ''} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} placeholder="0" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Status</label>
                  <select value={newProduct.status} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as 'active' | 'draft' | 'archived' })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <button onClick={handleAddProduct} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-button bg-purple-500/20 hover:bg-purple-500/30 font-medium text-sm">
                  <Save className="w-4 h-4" />
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Modal */}
      <AnimatePresence>
        {showCustomerModal && selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCustomerModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Customer Details</h2>
                <button onClick={() => setShowCustomerModal(false)} className="p-2 rounded-lg glass-button"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">{selectedCustomer.avatar}</span>
                </div>
                <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                <StatusBadge status={selectedCustomer.status} />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Mail className="w-4 h-4 opacity-60" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Phone className="w-4 h-4 opacity-60" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <ShoppingBag className="w-4 h-4 opacity-60" />
                  <span>{selectedCustomer.orders} orders</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <DollarSign className="w-4 h-4 opacity-60" />
                  <span>${selectedCustomer.spent.toLocaleString()} total spent</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Calendar className="w-4 h-4 opacity-60" />
                  <span>Joined {selectedCustomer.joinDate}</span>
                </div>
              </div>
              <button onClick={() => showToastNotification('Message Sent', `Email sent to ${selectedCustomer.email}`, 'success')} className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-button bg-purple-500/20 hover:bg-purple-500/30 font-medium text-sm">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discount Modal */}
      <AnimatePresence>
        {showDiscountModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDiscountModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Create Discount</h2>
                <button onClick={() => setShowDiscountModal(false)} className="p-2 rounded-lg glass-button"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Discount Code</label>
                  <input type="text" value={newDiscount.code} onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })} placeholder="e.g., SAVE20" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Type</label>
                  <select value={newDiscount.type} onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as 'percentage' | 'fixed' })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs opacity-60 mb-2 block">Value</label>
                  <input type="number" value={newDiscount.value || ''} onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })} placeholder={newDiscount.type === 'percentage' ? '20' : '50'} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs opacity-60 mb-2 block">Usage Limit</label>
                    <input type="number" value={newDiscount.limit || ''} onChange={(e) => setNewDiscount({ ...newDiscount, limit: Number(e.target.value) })} placeholder="100" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                  </div>
                  <div>
                    <label className="text-xs opacity-60 mb-2 block">Expiry Date</label>
                    <input type="date" value={newDiscount.expiry} onChange={(e) => setNewDiscount({ ...newDiscount, expiry: e.target.value })} className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" />
                  </div>
                </div>
                <button onClick={handleAddDiscount} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-button bg-purple-500/20 hover:bg-purple-500/30 font-medium text-sm">
                  <Plus className="w-4 h-4" />
                  Create Discount
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-bold mb-2">Confirm Action</h2>
              <p className="text-sm opacity-60 mb-6">{confirmMessage}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2.5 rounded-xl glass-button text-sm">Cancel</button>
                <button onClick={() => confirmAction?.()} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium text-sm">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-bold mb-2">Logout</h2>
              <p className="text-sm opacity-60 mb-6">Are you sure you want to logout from {settings.systemName}?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 rounded-xl glass-button text-sm">Cancel</button>
                <button onClick={confirmLogout} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium text-sm">Logout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
