// Shneiderman 1 · Único punto de acceso a lucide-react
import {
  Clock,
  CircleCheck,
  CircleX,
  Ban,
  Monitor,
  Presentation,
  Users,
  FlaskConical,
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  Building2,
  Sun,
  Moon,
  Menu,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  LogOut,
  AlertTriangle,
  Info,
  Search,
  Plus,
  Check,
  Loader2,
  HelpCircle
} from 'lucide-react';

const MAPA_ICONOS = {
  Clock,
  CircleCheck,
  CircleX,
  Ban,
  Monitor,
  Presentation,
  Users,
  FlaskConical,
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  Building2,
  Sun,
  Moon,
  Menu,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  LogOut,
  AlertTriangle,
  Info,
  Search,
  Plus,
  Check,
  Loader2,
  HelpCircle
};

export default function Icono({ nombre, className = 'w-5 h-5 shrink-0', ...props }) {
  const Componente = MAPA_ICONOS[nombre] || Info;
  return <Componente className={className} aria-hidden="true" {...props} />;
}
