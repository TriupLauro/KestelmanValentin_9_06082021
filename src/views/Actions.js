import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"
import eye_white from "../assets/svg/eye_white.js";

export default (billUrl) => {
    if (billUrl) {
        return (
            `<div class="icon-actions">
                <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
                    ${eyeBlueIcon}
                </div>
            </div>`
        )
    }else{
        return (`
            <div class="icon-actions">
                <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl} class="disabled">
                    ${eye_white}
                </div>
            </div>
        `)
    }

}