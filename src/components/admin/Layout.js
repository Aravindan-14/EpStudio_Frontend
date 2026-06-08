import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import AllProduct from "./AllProduct";
import OrderList from "../OrderList";
import CreatePost from "../CreatePost";
import { DataContext } from "../Contexts/DataContext";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  PlusCircle,
  LogOut,
  Menu,
  User,
  Bell,
  Search,
  ChevronDown,
  Settings
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Layout = () => {
  const [view, setView] = useState("products"); // State to handle view switching
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { users, setIsAuth } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  const renderView = () => {
    switch (view) {
      case "orders":
        return <OrderList show={true} />;
      case "create":
        return <CreatePost />;
      case "chats":
        return <Message />;
      default:
        return <AllProduct />;
    }
  };

  const menuItems = [
    { id: "products", label: "All Products", icon: LayoutDashboard },
    { id: "orders", label: "Total Orders", icon: ShoppingBag },
    { id: "chats", label: "Chat", icon: MessageSquare },
    { id: "create", label: "Create Post", icon: PlusCircle },
  ];

  // Shared sidebar inner layout
  const NavigationPanel = ({ onNavItemClick = () => {} }) => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 border-r border-slate-900 w-full">
      {/* Brand Logo Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-900">
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 h-9 w-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <span className="text-white font-extrabold text-sm tracking-tighter">EP</span>
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-white tracking-wide uppercase">
            EP Studio
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Management Shell
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = view === item.id || (item.id === "products" && view === "qwerty");
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => {
                setView(item.id);
                onNavItemClick();
              }}
              className={`w-full justify-start gap-3.5 px-4 py-6 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-600 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <IconComponent size={16} />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Admin User Profile Widget */}
      <div className="p-4 border-t border-slate-900">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-900 hover:border-slate-800 transition-colors cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-indigo-500/20">
                  <AvatarFallback className="bg-indigo-950 text-indigo-400 font-bold text-xs uppercase shadow-inner">
                    {users?.name ? users.name.charAt(0) : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white truncate max-w-[100px]">
                    {users?.name || "Administrator"}
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 bg-slate-950 border-slate-900 text-slate-300 rounded-xl p-1.5">
            <DropdownMenuItem className="text-xs font-semibold py-2.5 rounded-lg focus:bg-slate-900 focus:text-white cursor-pointer gap-2">
              <User size={14} /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs font-semibold py-2.5 rounded-lg focus:bg-slate-900 focus:text-white cursor-pointer gap-2">
              <Settings size={14} /> System Configuration
            </DropdownMenuItem>
            <div className="h-px bg-slate-900 my-1"></div>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-xs font-bold py-2.5 rounded-lg text-rose-400 focus:bg-rose-950/20 focus:text-rose-400 cursor-pointer gap-2"
            >
              <LogOut size={14} /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex bg-slate-50 h-screen w-screen overflow-hidden font-sans">
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="w-72 hidden md:block h-full flex-shrink-0 z-30">
        <NavigationPanel />
      </aside>

      {/* 2. Main Content shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Dynamic Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Hamburger Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors md:hidden h-10 w-10 flex-shrink-0"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-slate-950 border-r border-slate-900">
                <NavigationPanel onNavItemClick={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {view === "products" || view === "qwerty"
                ? "Products Catalog"
                : view === "orders"
                ? "Orders Registry"
                : view === "chats"
                ? "Customer Conversations"
                : "Add New Product"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative md:block hidden">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-64 bg-slate-50 transition-all font-medium text-slate-600"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl relative h-10 w-10"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full"></span>
            </Button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs">
                  {users?.name ? users.name.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider md:block hidden">
                {users?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Workspace */}
        <main className="flex-1 overflow-auto bg-slate-50 p-3 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Layout;


