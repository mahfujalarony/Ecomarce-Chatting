import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InputNumber } from 'antd';
import { normalizeImageUrl } from '../../utils/imageUrl';

const ProductGrid = ({
  products = [],
  viewAllLink = "/products",
  onAddToCart
}) => {
  const navigate = useNavigate();
  const handleAddToCartClick = onAddToCart;

  return (
    <div className="px-3 md:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3 mb-6">
        {products.map((product) => {
          const price = Number(product?.price || 0);
          const oldPrice = Number(product?.oldPrice || 0);
          const hasOldPrice = Number.isFinite(oldPrice) && oldPrice > price && price > 0;
          const discountPct = hasOldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden group"
            >
              <div className="h-28 md:h-32 w-full bg-gray-50 relative overflow-hidden">
                <img
                  src={normalizeImageUrl(product.images?.[0] || product.imageUrl?.[0]) || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-2 flex flex-col flex-grow">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5 truncate">
                  {product.category || 'General'}
                </p>

                <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1 h-8" title={product.name}>
                  {product.name}
                </h3>

                <div className="mt-auto">
                  <div className="flex flex-wrap items-baseline justify-between mb-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-900">${price.toFixed(2)}</p>
                        {hasOldPrice ? (
                          <span className="text-[10px] font-semibold text-emerald-600">-{discountPct}%</span>
                        ) : null}
                      </div>
                      {hasOldPrice ? (
                        <p className="text-[10px] text-gray-400 line-through">${oldPrice.toFixed(2)}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] text-yellow-500">*</span>
                      <span className="text-[10px] text-gray-500 ml-0.5">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <InputNumber
                      min={1}
                      max={10}
                      defaultValue={1}
                      size="small"
                      controls={false}
                      className="w-8 md:w-10 text-center rounded border-gray-200 text-[10px] h-7"
                    />
                    <button
                      onClick={() => handleAddToCartClick(product, 1)}
                      className="flex-grow bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-xs font-medium h-7 rounded flex items-center justify-center transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pb-8">
        <button
          onClick={() => navigate(viewAllLink)}
          className='text-center bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
