import React from 'react'
import { Link } from 'react-router-dom'

function CategoryList({ categories }) {
    const categoryList = [
        {
            id: 1,
            name: "How to buy a property?",
            description: "Learn how to buy a property on PakistanProperty.com by following these steps",
        },
        {
            id: 2,
                name: "How to sell a property?",
                description: "Learn how to sell a property on PakistanProperty.com by following these steps",
        },
        {
            id: 3,
            name: "How to Rent a property?",
            description: "Learn how to rent a property on PakistanProperty.com by following these steps",
        },
        {
            id: 4,
            name: "How to Lease a property?",
            description: "Learn how to lease a property on PakistanProperty.com by following these steps",
        },
        {
            id: 5,
            name:"How to add Agency",
            description: "Learn how to add an agency on PakistanProperty.com by following these steps",
        },
        {
            id: 6,
            name: "How to add a property?",
            description: "Learn how to add a property on PakistanProperty.com by following these steps",
        },
        
    ]
  return (
    <>
    <div className='category-list-help-center-heading'>
        <h2>Help Center</h2>
    </div>
    <div className='category-list-help-center'>
        {
            categories?.map((item) => (
                <Link to={`/help-center-subcategory/${item.slug}`}>
                <div className='category-item-help-center' key={item.id}>
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                </div>
                </Link>
            ))
        }

    </div>
    </>
  )
}

export default CategoryList