function Card({ className = "", ...props }) {
  return <div className={`card ${className}`} {...props} />;
}

function CardHeader({ className = "", ...props }) {
  return <div className={`card-header ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }) {
  return <div className={`card-title ${className}`} {...props} />;
}

function CardDescription({ className = "", ...props }) {
  return <div className={`card-description ${className}`} {...props} />;
}

function CardAction({ className = "", ...props }) {
  return <div className={`card-action ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={`card-content ${className}`} {...props} />;
}

function CardFooter({ className = "", ...props }) {
  return <div className={`card-footer ${className}`} {...props} />;
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};
