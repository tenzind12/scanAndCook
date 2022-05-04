export const rating = (nutriscore_grade) => {
  switch (nutriscore_grade) {
    case 'a':
      return '⭐⭐⭐⭐⭐';
    case 'b':
      return '⭐⭐⭐⭐';
    case 'c':
      return '⭐⭐⭐';
    case 'd':
      return '⭐⭐';
    case 'e':
      return '⭐';
    default:
      return 'No rating available :/';
  }
};

export const BASE_URL = 'https://test.tenzin.eu';

// prettier-ignore
export const filterArray=["and","vegetable","fresh","food","marketplace","their","product","paste","red","de","in","et","rouge","sec","dry","vegetale","boisson","frozen","meat","ready","france","source","naturelle","inc","white","free","verified","usa","artisan","natural","based","plant-based","beverage","or","australia","colour","color","artificial","no","flavor","processed","an","just","meal","crack","no-artificial-flavor","denver","scramble","kit","naturally","unknown","imported","coca-cola","coke","drink","cattle","fed","ground","hill","company","100","carrefour","le","bio","organic","maggi","fruit","of","canned","microwave"];
