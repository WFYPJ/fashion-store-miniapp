// utils/constants.js

const MAIN_CATEGORIES = ['Women', 'Men', 'Seniors', 'Teens', 'Underwear'];

const SUB_CATEGORY_MAP = {
  Women: ['T-shirt','Shirt','Sweatshirt','Sweater','Coat','Pants','Skirt','Dress','Suit','Trench','Down'],
  Men: ['T-shirt','Shirt','Sweatshirt','Sweater','Jacket','Suit','Coat','Pants','Down'],
  Seniors: ['T-shirt','Shirt','Sweater','Cardigan','Puffer','Pants','Down'],
  Teens: ['T-shirt','Sweatshirt','Hoodie','Sweater','Sweatpants','Jeans','Coat','Down'],
  Underwear: ['Briefs','Thermals','Pajamas']
};

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

module.exports = {
  MAIN_CATEGORIES,
  SUB_CATEGORY_MAP,
  SIZE_OPTIONS
};