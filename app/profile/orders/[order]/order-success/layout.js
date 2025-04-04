export async function generateMetadata({ params }) {
  return {
    title: `Order ${params.order}`,
  };
}

  
export default function OrderLayout({ children }) {
    return children;
}