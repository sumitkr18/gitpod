import { UserService } from "./user-service";
import { Identity, TokenEntry, User } from "@gitpod/gitpod-protocol";
import { UserDB } from "@gitpod/gitpod-db/lib";
import * as chai from "chai";
const expect = chai.expect;

describe("UserService", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        const us = userService as any;

        const userDb: UserDB = {
            deleteTokens: async (
                identity: Identity,
                shouldDelete?: ((entry: TokenEntry) => boolean) | undefined,
            ): Promise<void> => {},
            storeUser: async (user: User): Promise<User> => {
                return user;
            },
        } as UserDB;
        us.userDb = userDb;
        us.config = {
            disableDynamicAuthProviderLogin: true,
        };
        us.hostContextProvider = {
            findByAuthProviderId: (id: string) => {
                return {
                    authProvider: {
                        params: {
                            builtin: id === "github",
                        },
                    },
                };
            },
        };
    });

    describe("deauthorize", () => {
        it("removes the specified auth provider identity and associated tokens", async () => {
            // Arrange
            const user: User = {
                id: "123",
                identities: [{ authProviderId: "google" } as Identity, { authProviderId: "github" } as Identity],
            } as User;
            const authProviderIdToRemove = "google";

            // Act
            await userService.deauthorize(user, authProviderIdToRemove);

            // Assert
            expect(user.identities.length).to.eq(1);
            expect(user.identities[0].authProviderId).to.eq("github");
        });

        it("throws an error if trying to remove the last builtin auth provider", async () => {
            // Arrange
            const user: User = { id: "123", identities: [{ authProviderId: "github" } as Identity] } as User;
            const authProviderIdToRemove = "github";

            // Act and assert
            let thrown = false;
            try {
                await userService.deauthorize(user, authProviderIdToRemove);
            } catch (err) {
                thrown = true;
            }
            expect(thrown).to.eq(true);
            expect(user.identities.length).to.eq(1);
            expect(user.identities[0].authProviderId).to.eq("github");
        });

        it("does nothing if the specified auth provider identity is not found", async () => {
            // Arrange
            const user: User = {
                id: "123",
                identities: [{ authProviderId: "google" } as Identity, { authProviderId: "github" } as Identity],
            } as User;
            const authProviderIdToRemove = "facebook";

            // Act
            await userService.deauthorize(user, authProviderIdToRemove);

            // Assert
            expect(user.identities.length).to.eq(2);
            expect(user.identities[0].authProviderId).to.eq("google");
            expect(user.identities[1].authProviderId).to.eq("github");
        });
    });
});
