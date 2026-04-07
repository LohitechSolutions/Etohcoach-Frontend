Feature: Leaderboard

    Scenario: User navigates to Leaderboard
        Given I am a User loading Leaderboard
        When I navigate to the Leaderboard
        Then Leaderboard will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors