import DetailsPage from '@/components/properties/details/DetailsPage'

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: number }>
}

async function getProperty(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/property/${id}`, {
    next: {
      revalidate
    }
  })
  
  if (!res.ok) return null;

  const json = await res.json();
  return json.data
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id)
  
  if (!property) {
    return { title: "Property Not Found | Estatio" };
  }
  
  return {
    title: `${property.title} | Estatio`,
    description: property.description?.slice(0, 160),
  };
}

const page = async ({
  params
}: Readonly<PageProps>) => {
  const { id } = await params;
  const property = await getProperty(id)
  
  return (
    <DetailsPage initialData={property} propertyId={Number(id)} />
  )
}

export default page