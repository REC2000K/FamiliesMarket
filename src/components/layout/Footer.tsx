import { Link } from 'react-router-dom';
import { Library, Mail, Github, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700">
                <Library className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RevitLib</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Библиотека семейств Revit для архитекторов, инженеров и дизайнеров.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Каталог семейств
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  База знаний
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Видеоуроки
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Категории</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/?category=Архитектура" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Архитектура
                </Link>
              </li>
              <li>
                <Link to="/?category=Инженерные системы" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Инженерные системы
                </Link>
              </li>
              <li>
                <Link to="/?category=Конструкции" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Конструкции
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600">
                Email: support@revitlib.com
              </li>
              <li className="text-sm text-gray-600">
                По вопросам сотрудничества и размещения семейств
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} RevitLib. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
