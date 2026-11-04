// Shneiderman 1 · Trazo uniforme 1.8 · Único punto de acceso a lucide-react
import {
  Clock, CircleCheck, CircleX, Ban, Monitor, Presentation, Users,
  FlaskConical, LayoutDashboard, CalendarDays, CalendarPlus, Building2,
  Sun, Moon, Menu, X, Eye, EyeOff, ChevronDown, ChevronRight, ChevronLeft,
  LogOut, AlertTriangle, Info, Search, Plus, Check, Loader2, HelpCircle,
  Wrench, Sparkles, HardHat, Pencil, ArrowRightLeft, ArrowLeftRight, MoreHorizontal
} from 'lucide-react';

const ICONOS = {
  Clock, CircleCheck, CircleX, Ban, Monitor, Presentation, Users,
  FlaskConical, LayoutDashboard, CalendarDays, CalendarPlus, Building2,
  Sun, Moon, Menu, X, Eye, EyeOff, ChevronDown, ChevronRight, ChevronLeft,
  LogOut, AlertTriangle, Info, Search, Plus, Check, Loader2, HelpCircle,
  Wrench, Sparkles, HardHat, Pencil, ArrowRightLeft, ArrowLeftRight, MoreHorizontal
};

export default function Icono({
  nombre,
  className = 'w-4 h-4 shrink-0',
  strokeWidth = 1.8,
  ...props
}) {
  const Componente = ICONOS[nombre] || Info;
  return (
    <Componente
      className={`shrink-0 ${className}`}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}
