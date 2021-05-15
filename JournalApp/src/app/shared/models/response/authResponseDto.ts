export interface AuthResponseDto {
    isSuccessful: boolean;
    errors: string[];
    token: string;
}