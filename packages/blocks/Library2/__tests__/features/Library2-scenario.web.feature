Feature: Library2

    Scenario: User navigates to Library2
        Given I am a User loading Library2
        When I navigate to the Library2
        Then Library2 will load with out errors
        And I can enter text with out errors
        And I can select the button with with out errors
        And I can leave the screen with out errors