import { UserProfile } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Return 405 METHOD NOT ALLOWED if the request method is not POST
  if (req.method !== 'POST')
    return res.status(405).json({
      status: 405,
      message: 'Method not allowed',
    })

  // Get the body params
  const {
    officer,
    arrestee,
    arrest,
  }: {
    officer: UserProfile
    arrestee: {
      last_name: string
      first_name: string
      sex: 'Homme' | 'Femme'
      nationality: string
      vehicle?: string
      gun_licenses: ('A' | 'B' | 'C' | 'D' | 'E')[]
      phone?: string
      birthdate: string
      birthplace: string
      height: number
      weight: number
      address?: string
      drivers_licenses: ('A' | 'B' | 'C')[]
      profession?: string
    }
    arrest: {
      reason: string
      comment?: string
      confidentiality: 'Public' | 'Interne' | 'Confidentiel'
      description: string
    }
  } = req.body
  console.log(req.body)

  // Get the current date in Greenwich Mountain Time
  const currentDate = new Date().toLocaleDateString('en-GB', {
    timeZone: 'GMT',
  })

  // Return the bbcode
  return res.status(200).json({
    result: `[table style="width:90%; min-height:700px; margin: 0 auto; background:#EAEDED; color:#0; font-size:12px; -moz-box-shadow: inset 0px 0px 2px 0px #000000; -webkit-box-shadow: inset 0px 0px 2px 0px #000000; -o-box-shadow: inset 0px 0px 2px 0px #000000; box-shadow: inset 0px 0px 2px 0px #000000; filter:progid:DXImageTransform.Microsoft.Shadow(color=#0, Direction=NaN, Strength=2);"]
[tr style="vertical-align: top; height: 170px;"][td style="padding: 20px 20px 20px  20px;" width="1%"][img(140px,140px)]https://2img.net/i.ibb.co/zZ82Z1q/Badge-of-the-Las-Vegas-Metropolitan-Police-Department.png[/img][/td]
[td style="font-family:Serif; vertical-align:text-top;" width="90%"]
[size=16][b]BLOUNT COUNTY METROPOLITAN POLICE DEPARTEMENT[/b]
CRIMINAL RECORDS CHECK[/size]
[size=13]__[/size]
Reference number : XX-123456
Rapport d'arrestation du ${currentDate}
Fait le ${currentDate} à ${officer.district}
Rédigé par ${officer.rank === 'Cadet' ? 'le Cadet' : "l'Officier"} ${
      officer.name
    }
Affilié au district de ${officer.district}

[/td]
[/tr]


[tr style=][td style="vertical-align:top; padding:0px  0px 0px 0px; font-family:Arial;" colspan="2"]
[size=13]__[/size][/td]
[/tr]


[tr style=][td style="vertical-align:top; padding:5px  20px 30px 30px; font-family:Arial;" colspan="2"]
<h2>INFORMATIONS SUR L'ARRÊTÉ</h1><span style="width:48%; display:inline-block;"><div class="candid-content" style="text-align:left;">
<b>NOM : </b> ${arrestee.last_name}
<b>PRÉNOM : </b> ${arrestee.first_name}
<b>SEXE : </b> ${arrestee.sex}
<b>NATIONALITÉ : </b> ${arrestee.nationality}
<b>VÉHICULE : </b> ${
      arrestee.vehicle || "N'en possède pas et/ou n'en faisait pas l'usage"
    }
<b>LICENCE D'ARME : </b>${
      arrestee.gun_licenses.includes('A') ? 'A' : '[strike]A[/strike]'
    } - ${arrestee.gun_licenses.includes('B') ? 'B' : '[strike]B[/strike]'} - ${
      arrestee.gun_licenses.includes('C') ? 'C' : '[strike]C[/strike]'
    } - ${arrestee.gun_licenses.includes('D') ? 'D' : '[strike]D[/strike]'} - ${
      arrestee.gun_licenses.includes('E') ? 'E' : '[strike]E[/strike]'
    }
<b>NUMÉRO DE TÉLÉPHONE : </b> ${arrestee.phone || "N'en possède pas"} </div>
</span><span style="width:48%; float:right; display:inline-block;"><div class="candid-content" style="text-align:left;">
<b>DATE DE NAISSANCE : </b> ${arrestee.birthdate}
<b>LIEU DE NAISSANCE : </b> ${arrestee.birthplace}
<b>TAILLE </b>(en cm) : ${arrestee.height} cm
<b>MASSE </b>(en kg) : ${arrestee.weight} kg
<b>ADRESSE DE RÉSIDENCE : </b> ${
      arrestee.address || "L'individu a une adresse non-définie"
    }
<b>PERMIS POSSÉDÉ(S) : </b> ${
      arrestee.drivers_licenses.includes('A') ? 'A' : '[strike]A[/strike]'
    } - ${
      arrestee.drivers_licenses.includes('B') ? 'B' : '[strike]B[/strike]'
    } - ${arrestee.drivers_licenses.includes('C') ? 'C' : '[strike]C[/strike]'}
<b>PROFESSION : </b> ${arrestee.profession || 'Non-définie'}
</div></span>
<h2>INFORMATIONS SUR L'ARRESTATION</h1><span style="width:48%;float:right;display:inline-block;"></span><div class="candid-content" style="text-align:left;"><br>            &nbsp;
<b>DATE DE L'ARRESTATION : </b> ${currentDate}
<b>MOTIF DE L'ARRESTATION : </b> ${arrest.reason}
<b>NIVEAU DE CONFIDENTIALITE DU RAPPORT :</b> ${arrest.confidentiality}
<b>REMARQUE : </b> ${arrest.comment || 'Aucune'}

<b>NB : </b> Les individus sous 21 années d'âge, en situation de handicap, souffrantes, ou présentant d'autres circonstances, ont plus de risques d'être dépendant d'un adulte responsable. Ledit préjudice présente ainsi une situation d'atténuation.

<b>DESCRIPTION DÉTAILLÉE DE L'INFRACTION : </b>

[justify]${arrest.description}[/justify]
<br><br>

[center]<b>BLOUNT COUNTY METROPOLITAN POLICE DEPARTMENT</b>[/center]
</div>
[/td]
[/tr]

[/table]`,
  })
}
