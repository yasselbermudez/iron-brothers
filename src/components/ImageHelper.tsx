interface ImageHelperProps {
  imageName: string;
  alt: string;
  className?: string;
  isBackground?: boolean;
}

export const ImageHelper: React.FC<ImageHelperProps> = ({ 
  imageName, 
  alt, 
  className,
  isBackground = false 
}) => {
  const imagePath = `/images/${imageName}`;
  
  if (isBackground) {
    return (
      <div 
        className={className}
        style={{ 
          backgroundImage: `url(${imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        aria-label={alt}
      />
    );
  }
  
  return (
    <img 
      src={imagePath}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};