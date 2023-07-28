import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class AccountDTO {
    @MinLength(6)
    @IsString()
    username: string

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak',
    })
    password: string
}
