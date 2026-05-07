async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setIsLoading(true);

  const dataToSend = {
    skills: selectedSkills.join(","),
    preferredlocation: preferredLocation,
  };
  
  console.log("Sending to API:", dataToSend);

  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (response.ok) {
      toast.success("Profile updated successfully! 🎉");
      // Refresh the profile data
      const refreshResponse = await fetch("/api/profile");
      const refreshData = await refreshResponse.json();
      setProfile(refreshData);
      setSelectedSkills(refreshData.skills ? refreshData.skills.split(",").filter((s: string) => s) : []);
      setPreferredLocation(refreshData.preferredlocation || "");
    } else {
      toast.error(data.error || "Failed to update profile");
    }
  } catch (error) {
    console.error("Submit error:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
}