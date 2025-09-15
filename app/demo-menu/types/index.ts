export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  diet: string[];
  img: string;
  description: string;
}

export interface Category {
  key: string;
  label: string;
  icon: string;
}

export interface Filter {
  key: string;
  label: string;
}

export interface DailyMenu {
  title: string;
  hours: string;
  price: number;
  items: string[];
}

export interface MenuData {
  categories: Category[];
  filters: Filter[];
  dailyMenu: DailyMenu;
  items: MenuItem[];
}
