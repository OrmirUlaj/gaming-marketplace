interface CardProps {
  title: string;
  description: string;
  image?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card = ({ title, description, image, footer, onClick }: CardProps) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      {image && (
        <div className="aspect-w-16 aspect-h-9">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover" 
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t">
          {footer}
        </div>
      )}
    </div>
  );
};