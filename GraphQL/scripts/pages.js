import { loginAPI, profileAPI } from "./API.js"
import { querys } from "./querys.js"

let USER = {
    id: 0,
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    campus: "",
    auditRatio: 0,
    addressCity: "",
    createdAt: "",
    gender: "",
    tel: "",
    country: "",
}

let skillLevels = []

async function getSkillLevels() {
    const skill = await profileAPI(querys.skill)
    const result = skill.user[0].transactions.reduce((acc, c) => {
        acc[c.type] = c.amount
        return acc
    }, {})

    skillLevels.push(result)
}


async function insertUser() {

    const dataUser = await profileAPI(querys.user)

    USER.id = dataUser.user[0].id
    USER.username = dataUser.user[0].login
    USER.firstName = dataUser.user[0].firstName
    USER.lastName = dataUser.user[0].lastName
    USER.email = dataUser.user[0].email
    USER.campus = dataUser.user[0].campus
    USER.auditRatio = dataUser.user[0].auditRatio.toFixed(1)
    USER.addressCity = dataUser.user[0].attrs.addressCity
    USER.createdAt = new Date(dataUser.user[0].createdAt).toLocaleString()
    USER.gender = dataUser.user[0].attrs.gender
    USER.tel = dataUser.user[0].attrs.tel
    USER.country = dataUser.user[0].attrs.country
}








export async function showProfile() {

    // user information

    await insertUser()

    document.body.innerHTML = `
     <header>
        <div class="icon-zone">
         <p id="${USER.id}" class="name-talent"> Wellcome, ${USER.username}</p>
        </div>

        <div>
            <button class="log-out">Log-out</button>
        </div>
    </header>
    `
    const grid = document.createElement("div")
    grid.setAttribute("class", "grid-stat")



    const conntainer = document.createElement("div")
    conntainer.setAttribute("class", "container")
    conntainer.innerHTML = `
      <div class="user-info">
    
        <h2>User Information</h2>

        <p> <span> Username: </span>  ${USER.username} </p>
        <p> <span> First Name: </span> ${USER.firstName} </p>
        <p> <span> Last Name: </span> ${USER.lastName} </p>
        <p> <span> Email: </span> ${USER.email} </p>
        <p> <span> Campus: </span> ${USER.campus} </p>
        <p> <span> Account Created: </span> ${USER.createdAt} </p>
        <p> <span> Audit Ratio: </span> ${USER.auditRatio} </p>
        <p> <span> Address City: </span> ${USER.addressCity} </p>
        <p> <span> Gender: </span> ${USER.gender} </p>
        <p> <span> Tel: </span> ${USER.tel} </p>
        <p> <span> Country: </span> ${USER.country} </p>
            
        
    </div>
    `

    // append user info

    grid.append(conntainer)


    // current Level and xp

    const level = await profileAPI(querys.level)
    const xp = await profileAPI(querys.xp)

    const LEVEL = level.transaction[0].amount
    const XP = xp.transaction_aggregate.aggregate.sum.amount

    let p = XP / 1000
    let MXP = ""

    if (p > 1000) {
        MXP = `${p.toFixed(2) / 100} MB`
    } else {
        MXP = `${p.toFixed(2)} KB`
    }

    const stat = document.createElement("div")
    const statLevel = document.createElement("div")
    const statXP = document.createElement("div")
    stat.setAttribute("class", "stat-lx")
    statLevel.setAttribute("class", "stat-level")
    statXP.setAttribute("class", "stat-xp")

    statLevel.innerHTML = `
      <div class="stat">
            
      <div class="level"> 
        <p>  Current Level  </p>
            <div class="level-circle"> ${LEVEL} </div>
      </div>
        
    </div>
    `

    statXP.innerHTML = `
      <div class="stat">
            
      <div class="xp"> 
      <p>  Total XP  </p>
            <div class="xp-circle"> ${MXP} </div>
      </div>
        
    </div>
    `

    stat.append(statLevel, statXP)
    grid.append(stat)



    // skill Levels 

    await getSkillLevels()

    console.log(skillLevels);

    const skillContainer = document.createElement("div")
    skillContainer.setAttribute("class", "skill-container")

    const objSkill = Object.entries(skillLevels[0])
    console.log(objSkill);
    
    const divSkill = document.createElement("div")
    divSkill.setAttribute("class", "div-skill")

    objSkill.forEach(skill => {


        const type = document.createElement("p")
        const amount = document.createElement("p")
        type.textContent = skill[0].split("_")[1]
        amount.textContent = `${skill[1]}%`

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', '25')
        svg.setAttribute('height', `${skill[1]}%`)

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('width', `25`)
        rect.setAttribute('height', `${skill[1]}%`)
        rect.setAttribute('fill', 'green')

        svg.appendChild(rect)


        const skillBar = document.createElement("div")
        skillBar.setAttribute("class", "skill-bar")

        skillBar.append(amount, svg, type)

        divSkill.appendChild(skillBar)

        skillContainer.appendChild(divSkill)
    })



    document.body.append(grid, skillContainer)
    // log out 

    const log_out = document.querySelector(".log-out")
    log_out.addEventListener("click", () => {
        localStorage.removeItem("JWT")
        showLogin()
    })
}




export function showLogin() {
    document.body.innerHTML = `
    <div class="log-container">
        <div class="info-side">
            <h2>Welcome !</h2>
            <p>Log in to access your account</p>
        </div>
        <div class="login-form">
            <h1>Login</h1>
            <form id="login-form" method="post">
                <div class="form-group">
                    <label for="username">Nickname / Email</label>
                    <input type="text" id="username" name="email" placeholder="Nickname ola Email">
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" name="password" placeholder="password ..." required>
                </div>
                <p id="error-log"></p>
                <button type="submit" id="login-btn">Login</button>
            </form>
            
        </div>
    </div>
    </div>
    `

    loginAPI()
}