import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'gs_favorites';
export const FavoritesService = {
  async get(): Promise<number[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  },
  async toggle(id: number): Promise<number[]> {
    const current = await this.get();
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
  },
  async isFav(id: number): Promise<boolean> {
    const current = await this.get();
    return current.includes(id);
  }
};
