export const querys = {

    user: `
{
  user {
    id
    login
    firstName
    lastName
    campus
    email
    createdAt
    auditRatio
    createdAt
    attrs 
  }
}
`,

    level: `{
        transaction(
            where: {
                type: { _eq: "level" }
                event: { object: { name: { _eq: "Module" } } }
            }
            order_by: { amount: desc }
            limit: 1
        ){
            amount
        }
    }`,

    xp: `{
        transaction_aggregate(
            where: {
                type: { _eq: "xp" }
                event: { object: { name: { _eq: "Module" } } }
            }
        ) {
        aggregate {
            sum {
                amount
            }
        }
        }
    }`,

    skill: `{
         user {
            transactions(where: {type: {_like: "skill%"}}) {
                type
                amount
            }
        }
    }
    `



}




