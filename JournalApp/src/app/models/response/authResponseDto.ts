export interface AuthResponseDto {
    isSuccessful: boolean;
    errors: string[];
    id: number;
    token: string;
}